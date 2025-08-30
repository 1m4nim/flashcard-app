import React, { useState } from 'react';
import { Button, Input, List, Card, Typography, Space, message, Layout, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: '#fff', textAlign: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>単語帳アプリ</Typography.Title>
      </Header>
      <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Card style={{ width: '100%', maxWidth: 800, borderRadius: '8px' }}>
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
