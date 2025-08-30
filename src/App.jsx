import React, { useState } from 'react';
import { Button, Input, List, Card, Typography, Space, message, Layout, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, QuestionCircleOutlined, SwapOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Text } = Typography;

const App = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [editId, setEditId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wordToDeleteId, setWordToDeleteId] = useState(null);

  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuizWord, setCurrentQuizWord] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState('');

  const [isReverseQuiz, setIsReverseQuiz] = useState(false);

  const addWord = () => {
    if (newWord.trim() === '' || newTranslation.trim() === '') {
      message.error('単語と意味を入力してください。');
      return;
    }
    const newEntry = {
      id: Date.now(),
      text: newWord.trim(),
      translation: newTranslation.trim(),
    };
    setWords([...words, newEntry]);
    setNewWord('');
    setNewTranslation('');
    message.success('単語を追加しました。');
  };

  const showEditModal = (id, text, translation) => {
    setEditId(id);
    setNewWord(text);
    setNewTranslation(translation);
    setIsEditModalOpen(true);
  };

  const handleEdit = () => {
    if (newWord.trim() === '' || newTranslation.trim() === '') {
      message.error('単語と意味を入力してください。');
      return;
    }
    setWords(words.map(word =>
      word.id === editId ? { ...word, text: newWord.trim(), translation: newTranslation.trim() } : word
    ));
    setIsEditModalOpen(false);
    setEditId(null);
    setNewWord('');
    setNewTranslation('');
    message.success('単語を編集しました。');
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditId(null);
    setNewWord('');
    setNewTranslation('');
  };

  const showDeleteConfirm = (id) => {
    setWordToDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setWords(words.filter(word => word.id !== wordToDeleteId));
    setIsDeleteModalOpen(false);
    setWordToDeleteId(null);
    message.success('単語を削除しました。');
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setWordToDeleteId(null);
  };

  const startQuiz = () => {
    if (words.length === 0) {
      message.warn('単語がありません。追加してください。');
      return;
    }
    setIsQuizMode(true);
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentQuizWord(words[randomIndex]);
  };

  const endQuiz = () => {
    setIsQuizMode(false);
    setCurrentQuizWord(null);
    setQuizAnswer('');
  };

  const checkAnswer = () => {
    const correctAnswer = isReverseQuiz ? currentQuizWord.text : currentQuizWord.translation;
    if (quizAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      message.success('正解です！');
    } else {
      message.error(`不正解です。正解は "${correctAnswer}" です。`);
    }
    setQuizAnswer('');
    startQuiz();
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: '#fff', textAlign: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>単語帳アプリ</Typography.Title>
      </Header>
      <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Card style={{ minWidth: 500, maxWidth: 800, width: '100%', borderRadius: '8px' }}>
          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            {!isQuizMode ? (
              <Button
                type="primary"
                icon={<QuestionCircleOutlined />}
                onClick={startQuiz}
              >
                クイズ開始
              </Button>
            ) : (
              <Space>
                <Button type="default" icon={<SwapOutlined />} onClick={() => setIsReverseQuiz(!isReverseQuiz)}>
                  形式変更
                </Button>
                <Button type="default" onClick={endQuiz}>
                  クイズ終了
                </Button>
              </Space>
            )}
          </div>

          {!isQuizMode ? (
            <>
              <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
                <Input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="新しい単語"
                />
                <Input
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="意味"
                />
                <Button type="primary" onClick={addWord}>追加</Button>
              </Space.Compact>
              <List
                header={<div>単語リスト</div>}
                bordered
                dataSource={words}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(item.id, item.text, item.translation)} />,
                      <Button type="text" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item.id)} />,
                    ]}
                  >
                    <Text strong>{item.text}</Text>: <Text>{item.translation}</Text>
                  </List.Item>
                )}
              />
            </>
          ) : (
            currentQuizWord && (
              <Card style={{ textAlign: 'center' }}>
                <Typography.Title level={4}>
                  {isReverseQuiz ? currentQuizWord.translation : currentQuizWord.text}
                </Typography.Title>
                <Input
                  value={quizAnswer}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  placeholder="答えを入力してください"
                  onPressEnter={checkAnswer}
                  style={{ marginBottom: '16px' }}
                />
                <Button type="primary" onClick={checkAnswer}>回答</Button>
              </Card>
            )
          )}
        </Card>
      </Content>

      <Modal
        title="単語の編集"
        open={isEditModalOpen}
        onOk={handleEdit}
        onCancel={handleEditCancel}
      >
        <Input
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="単語"
          style={{ marginBottom: '16px' }}
        />
        <Input
          value={newTranslation}
          onChange={(e) => setNewTranslation(e.target.value)}
          placeholder="意味"
        />
      </Modal>

      <Modal
        title="単語の削除"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
      >
        <p>本当にこの単語を削除しますか？</p>
      </Modal>
    </Layout>
  );
};

export default App;
