import React, { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Add css for Quill editor

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false
});

const FileUpload = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // 파일을 로컬 저장소에 저장하고 URL을 설정하는 가정하에
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);

        const htmlContent = `
            <h1>${title}</h1>
            <p>${content}</p>
            <img src="${reader.result}" alt="${file.name}" />
        `;

        // 로컬 스토리지에 저장 (로컬 파일 시스템 접근은 보안 문제로 브라우저에서 직접 접근 불가)
        localStorage.setItem('communityDetail', htmlContent);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="content">Content:</label>
                <ReactQuill
                    value={content}
                    onChange={setContent}
                    theme="snow"
                    required
                />
            </div>
            <div>
                <label htmlFor="file">File:</label>
                <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <button type="submit">Upload</button>

            {imageUrl && (
                <div>
                    <h2>Uploaded Image Preview:</h2>
                    <img src={imageUrl} alt="Uploaded Preview" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </form>
    );
};

export default FileUpload;
