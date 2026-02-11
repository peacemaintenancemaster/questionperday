import { css } from '@emotion/react';

export const editorStyles = {
	controlGroup: css`
		display: flex;
		flex-direction: column;
		margin-bottom: 16px;
	`,
	buttonGroup: css`
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	`,
	button: css`
		padding: 8px 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #f9f9f9;
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;

		&:hover {
			background-color: #e6e6e6;
		}

		&:disabled {
			background-color: #f0f0f0;
			color: #aaa;
			cursor: not-allowed;
		}

		&.is-active {
			background-color: #958df1;
			color: #fff;
			border-color: #958df1;
		}
	`,
	editorContent: css`
		border: 1px solid #ddd;
		padding: 16px;
		border-radius: 4px;
		min-height: 200px;
		background-color: #fff;
		font-family: 'Arial', sans-serif;
		font-size: 16px;
		line-height: 1.5;

		&:focus {
			outline: none;
			border-color: #958df1;
		}
	`,
};
