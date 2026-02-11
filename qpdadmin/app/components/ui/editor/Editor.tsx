import React, {
	useState,
	useMemo,
	useRef,
	Suspense,
	useCallback,
	useEffect,
	memo,
} from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { config } from '~/config';
import { useAddPresignedImage } from '~/hooks/useAddPresigendImage';
import { debounce } from 'lodash-es';

interface Props {
	onChangeValue: (value: string) => void;
	value: string;
}

// React Quill을 모듈 레벨에서 한 번만 로드
let ReactQuill: any = null;
if (typeof window !== 'undefined') {
	ReactQuill = React.lazy(() => import('react-quill-new'));
}

// 이미지 URL 생성 함수 (순수 함수)
const createImageUrl = (imageId: string): string => {
	return config.image.host + imageId;
};

// 안전한 에디터 접근을 위한 헬퍼 함수
const getEditorSafely = (quillRef: React.RefObject<any>) => {
	try {
		const quill = quillRef.current;
		if (!quill) return null;

		const editor = quill.getEditor();
		if (!editor) return null;

		return editor;
	} catch (error) {
		console.warn('Editor not ready:', error);
		return null;
	}
};

// 이미지 삽입을 위한 유틸리티 함수들
const insertMultipleImages = (
	editor: any,
	images: { id: string; filename: string; ext: string }[],
	startPosition: number,
): number => {
	let currentPosition = startPosition;

	images.forEach((image, index) => {
		const imageUrl = createImageUrl(image.id);
		editor.insertEmbed(currentPosition, 'image', imageUrl);

		// 이미지 사이에 줄바꿈 추가 (마지막 이미지 제외)
		if (index < images.length - 1) {
			editor.insertText(currentPosition + 1, '\n\n');
			currentPosition += 3; // 이미지(1) + 줄바꿈(2)
		} else {
			currentPosition += 1; // 마지막 이미지만
		}
	});

	return currentPosition;
};

// 로딩 컴포넌트 분리
const LoadingComponent = () => (
	<div
		style={{
			height: '400px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}>
		에디터 로딩 중...
	</div>
);

export const Editor = memo(({ value, onChangeValue }: Props) => {
	const quillRef = useRef<any>(null);
	const { uploadMultiImage, isUploading } = useAddPresignedImage();
	const isComposingRef = useRef(false);
	const lastValueRef = useRef(value); // 마지막으로 부모에게 전달된 값
	const [isEditorReady, setIsEditorReady] = useState(false);

	// Quill 에디터의 현재 HTML 내용을 저장하는 ref (내부 상태)
	const internalEditorValueRef = useRef(value);

	// 에디터가 준비되었을 때 실행되는 콜백
	const onEditorReady = useCallback(() => {
		const editor = getEditorSafely(quillRef);
		if (!editor) return;

		setIsEditorReady(true);

		const handleCompositionStart = () => {
			isComposingRef.current = true;
		};

		const handleCompositionEnd = () => {
			isComposingRef.current = false;
		};

		const editorElement = editor.root;
		editorElement.addEventListener('compositionstart', handleCompositionStart);
		editorElement.addEventListener('compositionend', handleCompositionEnd);

		return () => {
			editorElement.removeEventListener(
				'compositionstart',
				handleCompositionStart,
			);
			editorElement.removeEventListener('compositionend', handleCompositionEnd);
		};
	}, []);

	// 에디터 초기화 및 이벤트 리스너 등록
	useEffect(() => {
		if (!isEditorReady) return;

		const cleanup = onEditorReady();
		return cleanup;
	}, [isEditorReady, onEditorReady]);

	// 여러 이미지 업로드 처리 함수
	const onMultipleImageUpload = useCallback(
		async (files: FileList) => {
			const uploadedImages = await uploadMultiImage(files);

			if (uploadedImages && uploadedImages.length > 0) {
				const editor = getEditorSafely(quillRef);
				if (!editor) return;

				// 현재 커서 위치와 포커스 상태 저장
				const range = editor.getSelection();
				const startPosition = range?.index;

				// insertMultipleImages 함수를 사용하여 이미지 삽입
				const finalPosition = insertMultipleImages(
					editor,
					uploadedImages,
					startPosition,
				);

				// 포커스 복원 및 커서 이동
				setTimeout(() => {
					const currentEditor = getEditorSafely(quillRef);
					if (currentEditor) {
						currentEditor.focus();
						currentEditor.setSelection(finalPosition);
					}
				}, 0);
			}
		},
		[uploadMultiImage],
	);

	const imageHandler = () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.setAttribute('multiple', 'true');
		input.click();

		input.onchange = async () => {
			const files = input?.files;
			if (!files || files.length === 0) return;

			const editor = getEditorSafely(quillRef);
			if (!editor) return;

			try {
				await onMultipleImageUpload(files);
			} catch (error) {
				console.error('이미지 업로드 실패:', error);
				alert('이미지 업로드에 실패했습니다.');
			}
		};
	};

	const modules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline', 'strike', 'blockquote'],
					[
						{ list: 'ordered' },
						{ list: 'bullet' },
						{ indent: '-1' },
						{ indent: '+1' },
					],
					['link', 'image', 'video'],
					['clean'],
				],
				handlers: {
					image: imageHandler,
				},
			},
			// 클립보드 모듈 설정으로 붙여넣기 최적화
			clipboard: {
				matchVisual: false,
			},
		}),
		[imageHandler],
	);

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'indent',
		'link',
		'image',
		'video',
	];

	// Debounce된 onChangeValue 함수
	const debouncedOnChangeValue = useMemo(
		() =>
			debounce((content: string) => {
				onChangeValue(content);
			}, 300), // 300ms 디바운스
		[onChangeValue],
	);

	// onChange 핸들러 최적화
	const onChangeContent = useCallback(
		(content: string, delta: any, source: string) => {
			// 한글 입력 중이면 무시
			if (isComposingRef.current) return;

			// 내부 에디터 값 업데이트
			internalEditorValueRef.current = content;

			// 값이 실제로 변경되었을 때만 부모에게 업데이트
			// 사용자 입력이거나, 이전 값과 다를 경우에만
			if (source === 'user' || content !== lastValueRef.current) {
				lastValueRef.current = content; // 마지막으로 부모에게 전달된 값 업데이트
				debouncedOnChangeValue(content); // 디바운스된 함수 호출
			}
		},
		[debouncedOnChangeValue], // 디바운스된 함수를 의존성 배열에 추가
	);

	// ReactQuill의 onReady 콜백
	const handleQuillReady = useCallback(() => {
		// 약간의 지연을 두어 에디터가 완전히 초기화되도록 함
		setTimeout(() => {
			setIsEditorReady(true);
			// 에디터가 로드된 후 초기 value를 internalEditorValueRef에 설정
			internalEditorValueRef.current = value;
		}, 100);
	}, [value]); // value를 의존성 배열에 추가하여 초기값 동기화

	if (typeof window === 'undefined' || !ReactQuill) {
		return <LoadingComponent />;
	}

	return (
		<div style={{ position: 'relative' }}>
			<Suspense fallback={<LoadingComponent />}>
				<ReactQuill
					ref={quillRef}
					theme='snow'
					value={value} // ReactQuill의 value prop은 부모에서 받은 값 그대로 사용
					onChange={onChangeContent}
					onReady={handleQuillReady}
					modules={modules}
					formats={formats}
					placeholder='내용을 입력하세요...'
					preserveWhitespace
					bounds='.quill'
					style={{
						width: '100%',
						height: '400px',
					}}
				/>
				{isUploading && (
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							background: 'rgba(255, 255, 255, 0.9)',
							padding: '20px',
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
							zIndex: 1000,
							pointerEvents: 'none',
						}}>
						이미지 업로드 중...
					</div>
				)}
			</Suspense>
		</div>
	);
});
