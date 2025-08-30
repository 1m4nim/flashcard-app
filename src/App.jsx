import React, { useState, useEffect } from 'react';
import { Button, Input, List, Card, Typography, Space, message, Layout, Modal, Grid } from 'antd';
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, SwapOutlined } from '@ant-design/icons';
import './App.css'; // このCSSファイルを追加します

const { Header, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const App = () => {
  const screens = useBreakpoint();
  const isMobile = screens.xs;

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
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasFinishedQuiz, setHasFinishedQuiz] = useState(false);
  const [answeredWordIds, setAnsweredWordIds] = useState(new Set());

  useEffect(() => {
    try {
      const storedWords = localStorage.getItem('flashcardWords');
      if (storedWords) {
        setWords(JSON.parse(storedWords));
      }
    } catch (error) {
      console.error('Failed to load words from local storage', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (words.length === 0) return;
      localStorage.setItem('flashcardWords', JSON.stringify(words));
    } catch (error) {
      console.error('Failed to save words to local storage', error);
    }
  }, [words]);

  const addWord = () => {
    if (!newWord.trim() || !newTranslation.trim()) {
      message.error('単語と意味を入力してください。');
      return;
    }
    const newEntry = { id: Date.now(), text: newWord.trim(), translation: newTranslation.trim() };
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
    if (!newWord.trim() || !newTranslation.trim()) {
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
    setCorrectCount(0);
    setTotalCount(0);
    setHasFinishedQuiz(false);
    setAnsweredWordIds(new Set());
    setCurrentQuizWord(words[0]);
  };

  const endQuiz = () => {
    setIsQuizMode(false);
    setCurrentQuizWord(null);
    setQuizAnswer('');
    setHasFinishedQuiz(false);
  };

  const checkAnswer = () => {
    const correctAnswer = isReverseQuiz ? currentQuizWord.text : currentQuizWord.translation;
    const isCorrect = quizAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    setTotalCount(prev => prev + 1);
    if (isCorrect) setCorrectCount(prev => prev + 1);

    setAnsweredWordIds(prev => new Set(prev.add(currentQuizWord.id)));
    setQuizAnswer('');

    const unansweredWords = words.filter(word => !answeredWordIds.has(word.id) && word.id !== currentQuizWord.id);
    if (unansweredWords.length === 0) setHasFinishedQuiz(true);
    else setCurrentQuizWord(unansweredWords[Math.floor(Math.random() * unansweredWords.length)]);
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Typography.Title level={isMobile ? 3 : 2} className="app-title">単語帳アプリ</Typography.Title>
      </Header>
      <Content className="app-content">
        <Card className="app-card">
          <div className="quiz-controls">
            {!isQuizMode ? (
              <Button type="primary" icon={<QuestionCircleOutlined />} onClick={startQuiz}>クイズ開始</Button>
            ) : (
              <Space direction={isMobile ? "vertical" : "horizontal"}>
                <Button type="default" icon={<SwapOutlined />} onClick={() => setIsReverseQuiz(!isReverseQuiz)}>形式変更</Button>
                <Button type="default" onClick={endQuiz}>クイズ終了</Button>
              </Space>
            )}
          </div>

          {!isQuizMode ? (
            <>
              <Space.Compact direction={isMobile ? "vertical" : "horizontal"} style={{ width: '100%', marginBottom: '20px' }}>
                <Input value={newWord} onChange={e => setNewWord(e.target.value)} placeholder="新しい単語" />
                <Input value={newTranslation} onChange={e => setNewTranslation(e.target.value)} placeholder="意味" />
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
            hasFinishedQuiz ? (
              <Card style={{ textAlign: 'center' }}>
                <Typography.Title level={4}>クイズ結果</Typography.Title>
                <p>正解数: {correctCount} / {totalCount}</p>
                <p>正答率: {totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(2) : 0}%</p>
                <Button type="primary" onClick={startQuiz}>もう一度挑戦</Button>
              </Card>
            ) : (
              currentQuizWord && (
                <Card style={{ textAlign: 'center' }}>
                  <Typography.Title level={4}>
                    {isReverseQuiz ? currentQuizWord.translation : currentQuizWord.text}
                  </Typography.Title>
                  <Input
                    value={quizAnswer}
                    onChange={e => setQuizAnswer(e.target.value)}
                    placeholder="答えを入力してください"
                    onPressEnter={checkAnswer}
                    style={{ marginBottom: '16px' }}
                  />
                  <Button type="primary" onClick={checkAnswer}>回答</Button>
                  <div style={{ marginTop: '16px' }}>
                    <Text type="secondary">正解数: {correctCount} / {words.length}</Text>
                  </div>
                </Card>
              )
            )
          )}
        </Card>
      </Content>

      <Modal title="単語の編集" open={isEditModalOpen} onOk={handleEdit} onCancel={handleEditCancel}>
        <Input value={newWord} onChange={e => setNewWord(e.target.value)} placeholder="単語" style={{ marginBottom: '16px' }} />
        <Input value={newTranslation} onChange={e => setNewTranslation(e.target.value)} placeholder="意味" />
      </Modal>

      <Modal title="単語の削除" open={isDeleteModalOpen} onOk={handleDelete} onCancel={handleDeleteCancel}>
        <p>本当にこの単語を削除しますか？</p>
      </Modal>
    </Layout>
  );
};

export default App;