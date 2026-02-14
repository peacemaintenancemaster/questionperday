// handleSubmit 함수 내부의 insert 로직 확인
const { error } = await supabase.from('answer').insert({
  // 1. DB의 컬럼명이 'question_id'라면 아래와 같이 작성
  question_id: question?.id, 
  user_id: user?.id,
  
  // 2. 만약 DB 컬럼을 'questionId'로 만드셨다면 아래와 같이 작성
  // questionId: question?.id,
  // userId: user?.id,
  
  text: text,
  nickname: nickname.trim() || '',
  phone: phone.trim() || '', // 이 부분이 DB의 'phone' 컬럼과 매칭됩니다.
  isDel: 0,
});