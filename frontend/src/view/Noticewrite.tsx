import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style/NoticeForm.css';
import axios from 'axios';

interface Notice {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  views: number;
  comments: number;
}

interface NoticeFormProps {
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ notices, setNotices }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const notice = isEdit ? notices.find(n => n.id === Number(id)) : undefined;
  const quillRef = useRef<ReactQuill>(null);

  const [title, setTitle] = useState<string>(notice?.title || '');
  const [author, setAuthor] = useState<string>(notice?.author || '');
  const [content, setContent] = useState<string>(notice?.content || '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = async () => {
    if (!title || !author || !content) {
      message.warning('모든 필드를 입력해주세요.');
      return;
    }

    const newNotice: Notice = {
      id: isEdit ? notice!.id : notices.length + 1,
      title,
      author,
      date: new Date().toISOString().split('T')[0],
      content,
      views: isEdit ? notice!.views : 0,
      comments: isEdit ? notice!.comments : 0,
    };

    try {
      if (isEdit) {
        const response = await axios.put(`http://localhost:4000/notices/${id}`, newNotice);
        setNotices(notices.map(n => (n.id === newNotice.id ? response.data : n)));
      } else {
        const response = await axios.post('http://localhost:4000/notices', newNotice);
        setNotices([...notices, response.data]);
      }
      message.success('공지사항이 저장되었습니다.');
      navigate('/noticelist');
    } catch (error) {
      console.error('Error saving notice:', error);
      message.error('공지사항 저장에 실패했습니다.');
    }
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  return (
    <div className="community-form">
      <Form layout="vertical" onFinish={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Form.Item label="제목" required>
          <Input value={title} onChange={handleTitleChange} />
        </Form.Item>
        <div className="author-boardid-row">
          <Form.Item label="작성자" required style={{ flex: 1, marginRight: '8px' }}>
            <Input value={author} onChange={handleAuthorChange} />
          </Form.Item>
        </div>
        <Form.Item label="내용" required>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            modules={modules}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">저장</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NoticeForm;
