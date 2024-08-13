import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SidebarLayout from './SidebarLayout';
import './style/getMyInfo.css';

const GetMyInfo = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [userForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const onEdit = (values: any) => {
    console.log('Form values:', values);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('로그인 후 이용해주세요.');
        return;
      }

      try {
        const response = await axios.get('http://43.202.240.147:8080/api/user/info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { email, userName, profileImageUrl, point } = response.data;
        console.log('Fetched user info:', response.data); // 디버깅 로그 추가
        userForm.setFieldsValue({ email, userName, point });
        
        // 로컬 스토리지에서 이미지 URL을 가져옵니다.
        const savedImageUrl = localStorage.getItem('profileImageUrl');
        if (savedImageUrl) {
          setProfileImage(savedImageUrl);
        } else if (profileImageUrl) {
          setProfileImage(profileImageUrl);
          localStorage.setItem('profileImageUrl', profileImageUrl);
        }
        
        setLoading(false);
      } catch (error) {
        message.error('유저 정보를 가져오는데 실패했습니다.');
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userForm]);

  const handleImageUpload = async (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 파일이 성공적으로 업로드되었습니다.`);
      if (info.file.response && info.file.response.imageUrl) {
        const fullImageUrl = `http://43.202.240.147:8080${info.file.response.imageUrl}`;
        setProfileImage(fullImageUrl);
        // 로컬 스토리지에 이미지 URL을 저장합니다.
        localStorage.setItem('profileImageUrl', fullImageUrl);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 파일 업로드에 실패했습니다.`);
    }
  };

  const beforeUpload = (file: File) => {
    const isLt5M = file.size / 1024 / 1024 < 100;
    if (!isLt5M) {
      message.error('파일은 5MB보다 작아야 합니다!');
    }
    return isLt5M;
  };

  const handleConvertPointToCash = async () => {
    const token = localStorage.getItem('token');
    const email = userForm.getFieldValue('email');

    if (!token || !email) {
      message.error('로그인 후 이용해주세요.');
      return;
    }

    try {
      await axios.post('http://43.202.240.147:8080/api/user/pointTocash', { email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('포인트가 성공적으로 현금으로 변환되었습니다.');
      window.location.reload(); // 페이지 새로 고침
    } catch (error) {
      message.error('포인트 현금 변환에 실패했습니다.');
      console.error(error);
    }
  };

  const isMobile = window.innerWidth <= 768;

  const UploadComponent = () => (
    <div className="profile-image-container">
      <Upload
        name="file"
        listType="picture-card"
        className={`avatar-uploader ${profileImage ? 'has-image' : ''}`}
        showUploadList={false}
        action="http://43.202.240.147:8080/uploads"
        beforeUpload={beforeUpload}
        onChange={handleImageUpload}
      >
        {profileImage ? (
          <img 
            src={profileImage} 
            alt="프로필 이미지" 
            className="profile-image"
          />
        ) : (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className='parent-wrapper'>
          <div className="wrapper02">
            <UploadComponent />
          </div>
          <div className="wrapper01">
            <Form onFinish={onEdit} form={userForm}>
              <Form.Item style={{ width: "100%", marginBottom: "0" }}>
                <Form.Item
                  name="email"
                  label={<b>이메일</b>}
                  style={{ width: "100%", display: "block" }}
                >
                  <Input size="large" disabled />
                </Form.Item>
                <Form.Item
                  name="userName"
                  label={<b>유저 닉네임</b>}
                  style={{ width: "100%", display: "block" }}
                >
                  <Input size="large" disabled />
                </Form.Item>
                <Form.Item
                  name="point"
                  label={<b>포인트</b>}
                  style={{ width: "100%", display: "block" }}
                >
                  <Input size="large" disabled />
                </Form.Item>
              </Form.Item>
            </Form>
            <Button type="primary" className="change-info-button">고객정보 변경</Button>
            <Button type="primary" className="convert-point-button" onClick={handleConvertPointToCash}>포인트 현금 변환</Button>
            <Button type="primary" className="delete-account">회원탈퇴</Button>
          </div>
        </div>
      ) : (
        <SidebarLayout selectedKey={selectedKey} onMenuClick={handleMenuClick}>
          <div className='parent-wrapper'>
            <div className="wrapper02">
              <UploadComponent />
            </div>
            <div className="wrapper01">
              <Form onFinish={onEdit} form={userForm}>
                <Form.Item style={{ width: "100%", marginBottom: "0" }}>
                  <Form.Item
                    name="email"
                    label={<b>이메일</b>}
                    style={{
                      width: "calc(100% - 8px)",
                      display: "inline-block",
                      marginLeft: "8px",
                    }}>
                    <Input size="large" disabled />
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ width: "100%", marginBottom: "0" }}>
                  <Form.Item
                    name="userName"
                    label={<b>유저 닉네임</b>}
                    style={{ width: "calc(100% - 8px)", display: "inline-block" }}
                  >
                    <Input size="large" disabled />
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ width: "100%", marginBottom: "0" }}>
                  <Form.Item
                    name="point"
                    label={<b>포인트</b>}
                    style={{ width: "calc(100% - 8px)", display: "inline-block" }}
                  >
                    <Input size="large" disabled />
                  </Form.Item>
                </Form.Item>
              </Form>
              <Button type="primary" className="change-info-button">고객정보 변경</Button>
              <Button type="primary" className="convert-point-button" onClick={handleConvertPointToCash}>포인트 현금 변환</Button>
              <Button type="primary" className="delete-account">회원탈퇴</Button>
            </div>
          </div>
        </SidebarLayout>
      )}
    </>
  );
};

export default GetMyInfo;
