import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Space, Input, message, Pagination } from 'antd';
import axios from 'axios';
import './style/Community.css';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  views: number;
  comments: number;
  boardId: string;
}

interface CommunityPageProps {
  hideInput?: boolean;
  customStyle?: React.CSSProperties;
  h1Style?: React.CSSProperties;
}

const Community: React.FC<CommunityPageProps> = ({ hideInput, customStyle, h1Style }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>(''); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // 페이지당 게시물 수
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://43.202.240.147:8080/api/posts'); // 전체 게시글 가져오는 엔드포인트로 수정
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        message.error('게시물을 불러오는 데 실패했습니다.');
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleNavigate = async () => {
    if (searchKeyword) {
      try {
        const response = await axios.get(`http://43.202.240.147:8080/api/posts?title=${encodeURIComponent(searchKeyword)}`);
        setFilteredPosts(response.data);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
      } catch (error) {
        console.error('Error fetching posts:', error);
        message.error('검색 결과를 불러오는 데 실패했습니다.');
      }
    } else {
      message.warning('검색어를 입력해주세요.');
      setFilteredPosts(posts);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const startIndex = (currentPage - 1) * pageSize;
  const currentPosts = sortedPosts.slice(startIndex, startIndex + pageSize);

  return (
    <div className={`community-list ${hideInput ? 'trading-page-style' : ''}`} style={customStyle}>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        <h1 style={h1Style}>전체 게시판</h1>

        <div className="desktop-view">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'center', width: '10%' }}>종 목</th>
                <th style={{ textAlign: 'center', width: '40%' }}>제 목</th>
                <th style={{ textAlign: 'center', width: '10%' }}>작성자</th>
                <th style={{ textAlign: 'center', width: '15%' }}>날 짜</th>
                <th style={{ textAlign: 'center', width: '10%' }}>댓글 수</th>
                <th style={{ textAlign: 'center', width: '10%' }}>조회수</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map(post => (
                <tr key={`${post.boardId}-${post.id}`}>
                  <td style={{ textAlign: 'center' }}>{post.boardId}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Link to={`/community/${post.boardId}/${post.id}`}>{post.title}</Link>
                  </td>
                  <td style={{ textAlign: 'center' }}>{post.author}</td>
                  <td style={{ textAlign: 'center' }}>{post.date}</td>
                  <td style={{ textAlign: 'center' }}>{post.comments}</td>
                  <td style={{ textAlign: 'center' }}>{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="write-button-container">
            <Link to={`/community/000000/new`}>
              <Button type="primary" className="button">글 작성</Button>
            </Link>
          </div>
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPosts.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="pagination"
            />
          </div>
        </div>

        <div className="mobile-view">
          <ul className="mobile-list">
            {currentPosts.map(post => (
              <li key={`${post.boardId}-${post.id}`}>
                <Link to={`/community/${post.boardId}/${post.id}`}>
                  <h3>{post.title}</h3>
                  <div className="info-row">
                    <p className="info-item">종목: {post.boardId}</p>
                    <p className="info-item">작성자: {post.author}</p>
                  </div>
                  <div className="info-row">
                    <p className="info-item">댓글: {post.comments}</p>
                    <p className="info-item">조회수: {post.views}</p>
                  </div>
                  <p className="info-item date-item">날짜: {post.date}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="write-button-container">
            <Link to={`/community/000000/new`}>
              <Button type="primary" className="button">글 작성</Button>
            </Link>
          </div>
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPosts.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="pagination"
            />
          </div>
        </div>

        {!hideInput &&
          <div className="navigate-board">
            <Input
              placeholder="제목을 입력하세요"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <Button type="primary" className="navigate-button" onClick={handleNavigate}>검색</Button>
          </div>
        }
      </Space>
    </div>
  );
};

export default Community;
