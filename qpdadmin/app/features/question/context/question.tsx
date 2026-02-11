import { produce } from 'immer';
import type {
	QuestionBaseSchema,
	QuestionSchemaWithType,
} from '../schema/question.add';
import React, {
	createContext,
	useEffect,
	useReducer,
	type PropsWithChildren,
} from 'react';
import type { QuestionType } from '~/types/answer/answer';
import { format } from 'date-fns';

export type QuestionBaseSchemaWithId = QuestionBaseSchema & {
	id?: number;
	type: QuestionType;
	article?: string;
};

type State = {
	calendarMap: Record<string, QuestionBaseSchemaWithId>;
	list: QuestionSchemaWithType[];
};

export type Action =
	| {
			type: 'MONTH';
			payload: Record<string, QuestionBaseSchemaWithId>;
	  }
	| {
			type: 'TEMP';
			payload: QuestionBaseSchema;
	  }
	| {
			type: 'DEL_QUESTION';
			payload: string;
	  }
	| {
			type: 'SAVE';
			payload: QuestionBaseSchema;
	  }
	| {
			type: 'SAVE_LIST';
			payload: QuestionBaseSchema;
	  }
	| {
			type: 'LIST';
			payload: QuestionSchemaWithType[];
	  }
	| {
			type: 'DEL_QUESTION_LIST';
			payload: number;
	  };

const initialState: State = {
	calendarMap: {},
	list: [],
};

function reducer(state: State, action: Action) {
	return produce(state, draft => {
		switch (action.type) {
			case 'MONTH':
				Object.assign(draft.calendarMap, action.payload);
				break;
			case 'DEL_QUESTION':
				delete draft.calendarMap[action.payload];
				break;

			case 'SAVE':
				(draft.calendarMap[
					format(new Date(action.payload.dateAt), 'yyyy-MM-dd')
				] as any) = action.payload;
				break;

			case 'SAVE_LIST':
				draft.list = [action.payload, ...draft.list];
				break;

			case 'LIST':
				draft.list = action.payload;
				break;

			case 'DEL_QUESTION_LIST': {
				draft.list = draft.list.filter(x => x.id !== action.payload);
				break;
			}

			default:
				break;
		}
	});
}

interface Context {
	state: State;
	dispatch: React.Dispatch<Action>;
}

export const QuestionContext = createContext<Context>({
	state: initialState,
	dispatch: () => null,
});

export function QuestionProvider({ children }: PropsWithChildren) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<QuestionContext value={{ state, dispatch }}>{children}</QuestionContext>
	);
}
