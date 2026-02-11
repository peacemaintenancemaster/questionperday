import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('/login', 'routes/login.tsx'),
    route('/banner', 'routes/banner.tsx'),
    
    // PreviewItem의 useGetAnswerList(id) 요청을 처리하기 위한 경로 추가
    route('question/:id/answer', 'routes/question.$id.answer.ts'),
] satisfies RouteConfig;