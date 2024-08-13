import { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";

const NewPage = () => {
    const [counter, setCounter] = useState<number>(0);

    // 이거는 페이지가 로딩 될때마다 발동되는 코드를 정의하는거임!
    useEffect(() => {
        console.log("유즈 이펙트야!!!")
    }, []);

    useEffect(() => {
        console.log("카운터가 눌렸어요!!")
    }, [counter]);

    return (
        <div>
            새로운 페이지 입니다!
            <button onClick={() => {
                setCounter(counter + 1);
            }}>버튼1</button>
            <Button>버튼2</Button>
            <Form>
                <Form.Item label="나이를 입력하세요">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">보내기!</Button>
                </Form.Item>
            </Form>
            <div>현재 숫자: {counter}</div>
        </div>
    )
}

export default NewPage;
