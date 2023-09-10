/*
    발제문2
    
    우리 팀은 현재 회사의 새로운 먹거리가 될 신규 개발을 담당하고 있습니다.
    덕분에 아주 빡빡한 일정으로 돌아 가고 있습니다.

    API가 모든 경우에 대해 개발하면 좋겠지만, 시간적인 여유가 없습니다.
    그래서 우리는 지금 당장은 API 호출을 조금 조합을 하기로 결정합니다.

    아래 2개의 API를 사용하여, 최종적으로는 아래와 같은 결과를 얻고 싶습니다.
    이때, 결과물을 최대한 빨리 만들고 싶습니다. 어떻게 해야할까요?
*/
const users = [
    { id: 1, name: 'AA', age: 35, followers: [3, 5, 6, 7, 8] },
    { id: 2, name: 'BB', age: 26, followers: [] },
    { id: 3, name: 'CC', age: 28, followers: [4, 10] },
    { id: 4, name: 'DD', age: 32, followers: [] },
    { id: 5, name: 'EE', age: 34, followers: [] },
    { id: 6, name: 'FF', age: 23, followers: [] },
    { id: 7, name: 'GG', age: 27, followers: [] },
    { id: 8, name: 'HH', age: 31, followers: [] },
    { id: 9, name: 'II', age: 33, followers: [] },
    { id: 10, name: 'JJ', age: 30, followers: [] },
]

const fetchUser = id => new Promise(resolve => {
    const user = users.find(user => user.id === id);
    setTimeout(() => {
        resolve(user);
    }, 500);
});

const fetchUsers = (ids) => new Promise(resolve => {
    const result = [];
    for (const user of users) {
        result.push(ids.find(id => id === user.id))
    }

    setTimeout(() => {
        resolve(result);
    }, 500);
});

// 원하는 결과
// "AA의 팔로워는 {팔로워이름}, {팔로워이름}, {팔로워이름}, {팔로워이름} 입니다."
