/*
    pipeline + chain 과 async/await 의 차이점은 무엇인가?
    둘은 풀고자 하는 문제가 다르다

    - pipeline + chain 은 명령형 프로그래밍을 하지 않고, 안전하게 함수합성을 위해서 사용한다.
        - 함수합성을 위해 사용하는 것이지, 비동기와 직접적으로 연관있지 않다.
        - Promise는 비동기 해결을 함수합성 내에서 해결하기 위해 자연스럽게 사용될 뿐이다.
    - async/await 은 
        - Promise().then().then().then().then() 으로 이어졌을 시, 가독성이나 사용성이 떨어지기 때문에
         문장형으로 풀어쓰기 위해 async/await 을 사용한다.

*/