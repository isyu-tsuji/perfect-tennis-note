'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Target, Zap, Brain, Trophy, Calendar, Star, Filter, Download, ChevronDown, Edit3, Save, Trash2 } from 'lucide-react';

const PerfectTennisNote = () => {
  const [todos, setTodos] = useState<any>({});
  const [inputValues, setInputValues] = useState<any>({});
  const [filterDate, setFilterDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dailyChecklist, setDailyChecklist] = useState<any>({});
  const [customChecklistItems, setCustomChecklistItems] = useState<any>([]);
  const [isEditingChecklist, setIsEditingChecklist] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const categories = [
    {
      id: 'shots',
      title: 'ショット技術',
      icon: <Target className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      items: ['フォアハンド', 'バックハンド', 'サーブ', 'ボレー', 'スマッシュ', 'ドロップショット', 'ロブ', 'リターン']
    },
    {
      id: 'physical',
      title: '肉体面',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      items: ['フットワーク', 'スタミナ', '筋力トレーニング', 'ストレッチ', 'バランス', 'スピード', '瞬発力', 'コーディネーション']
    },
    {
      id: 'mental',
      title: '精神面',
      icon: <Brain className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      items: ['集中力', 'メンタルコントロール', 'プレッシャー対応', 'モチベーション', 'イメージトレーニング', 'リラクゼーション', 'ポジティブ思考']
    },
    {
      id: 'strategy',
      title: '戦略・戦術',
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      items: ['ゲームプラン', 'パターン練習', '相手分析', 'ポジショニング', 'リスクマネジメント', 'ダブルス戦術']
    }
  ];

  // デフォルトチェックリスト項目
  const defaultChecklistItems = [
    { id: 'posture', text: '基本姿勢の確認（足の位置、膝の曲げ）' },
    { id: 'grip', text: 'ラケットグリップの確認' },
    { id: 'breathing', text: '打つ前の深呼吸を意識' },
    { id: 'footwork', text: '早めの準備とフットワーク' },
    { id: 'followthrough', text: 'フォロースルーを最後まで' },
    { id: 'concentration', text: '1ポイント1ポイントに集中' },
    { id: 'positive', text: 'ポジティブな声かけ' },
    { id: 'warmup', text: '十分なウォーミングアップ' }
  ];

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem('perfectTennisNoteTodos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    }

    const savedChecklist = localStorage.getItem('perfectTennisNoteChecklist');
    if (savedChecklist) {
      try {
        setDailyChecklist(JSON.parse(savedChecklist));
      } catch (error) {
        console.error('チェックリストの読み込みに失敗しました:', error);
      }
    }

    const savedCustomItems = localStorage.getItem('perfectTennisNoteCustomItems');
    if (savedCustomItems) {
      try {
        setCustomChecklistItems(JSON.parse(savedCustomItems));
      } catch (error) {
        console.error('カスタムアイテムの読み込みに失敗しました:', error);
        setCustomChecklistItems(defaultChecklistItems);
      }
    } else {
      setCustomChecklistItems(defaultChecklistItems);
    }
  }, []);

  // データ保存
  useEffect(() => {
    localStorage.setItem('perfectTennisNoteTodos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('perfectTennisNoteChecklist', JSON.stringify(dailyChecklist));
  }, [dailyChecklist]);

  useEffect(() => {
    localStorage.setItem('perfectTennisNoteCustomItems', JSON.stringify(customChecklistItems));
  }, [customChecklistItems]);

  const addTodo = (category: string, subcategory: string) => {
    const key = `${category}-${subcategory}`;
    const inputValue = inputValues[key]?.trim();
    
    if (!inputValue) return;

    setTodos((prev: any) => ({
      ...prev,
      [key]: [
        ...(prev[key] || []),
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          timestamp: new Date().toLocaleString('ja-JP'),
          dateOnly: new Date().toISOString().split('T')[0],
          priority: 'medium'
        }
      ]
    }));

    setInputValues((prev: any) => ({
      ...prev,
      [key]: ''
    }));
  };

  const toggleTodo = (category: string, subcategory: string, todoId: number) => {
    const key = `${category}-${subcategory}`;
    setTodos((prev: any) => ({
      ...prev,
      [key]: prev[key].map((todo: any) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const deleteTodo = (category: string, subcategory: string, todoId: number) => {
    const key = `${category}-${subcategory}`;
    setTodos((prev: any) => ({
      ...prev,
      [key]: prev[key].filter((todo: any) => todo.id !== todoId)
    }));
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, category: string, subcategory: string) => {
    if (e.key === 'Enter') {
      addTodo(category, subcategory);
    }
  };

  const getTotalTodos = () => {
    return Object.values(todos).reduce((total: number, categoryTodos: any) => total + categoryTodos.length, 0);
  };

  const getCompletedTodos = () => {
    return Object.values(todos).reduce((total: number, categoryTodos: any) => 
      total + categoryTodos.filter((todo: any) => todo.completed).length, 0
    );
  };

  const getProgressPercent = () => {
    const total = getTotalTodos();
    const completed = getCompletedTodos();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getFilteredTodos = (categoryTodos: any[]) => {
    if (!filterDate) return categoryTodos;
    return categoryTodos.filter((todo: any) => todo.dateOnly === filterDate);
  };

  const getAvailableDates = () => {
    const dates = new Set<string>();
    Object.values(todos).forEach((categoryTodos: any) => {
      categoryTodos.forEach((todo: any) => {
        dates.add(todo.dateOnly);
      });
    });
    return Array.from(dates).sort().reverse();
  };

  const clearAllData = () => {
    if (window.confirm('⚠️ すべてのデータを削除しますか？この操作は取り消せません。')) {
      setTodos({});
      setDailyChecklist({});
      localStorage.removeItem('perfectTennisNoteTodos');
      localStorage.removeItem('perfectTennisNoteChecklist');
      alert('✅ すべてのデータを削除しました。');
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDailyChecklist((prev: any) => ({
      ...prev,
      [today]: {
        ...prev[today],
        [itemId]: !prev[today]?.[itemId]
      }
    }));
  };

  const getTodayChecklistProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayChecklist = dailyChecklist[today] || {};
    const completed = Object.values(todayChecklist).filter(Boolean).length;
    return { completed, total: customChecklistItems.length };
  };

  // チェックリスト編集機能
  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim()
    };
    
    setCustomChecklistItems((prev: any) => [...prev, newItem]);
    setNewChecklistItem('');
  };

  const deleteChecklistItem = (itemId: string) => {
    setCustomChecklistItems((prev: any) => prev.filter((item: any) => item.id !== itemId));
  };

  const updateChecklistItem = (itemId: string, newText: string) => {
    setCustomChecklistItems((prev: any) => 
      prev.map((item: any) => 
        item.id === itemId ? { ...item, text: newText } : item
      )
    );
  };

  const exportToMarkdown = () => {
    const currentDate = new Date().toLocaleDateString('ja-JP');
    const filterDateText = filterDate ? `（${filterDate}のデータ）` : '';
    
    let markdown = `# 🎾 パーフェクトテニスノート ${filterDateText}\n\n`;
    markdown += `**出力日**: ${currentDate}\n`;
    markdown += `**総タスク数**: ${getTotalTodos()}\n`;
    markdown += `**完了数**: ${getCompletedTodos()}\n`;
    markdown += `**進捗率**: ${getProgressPercent()}%\n\n`;

    const today = new Date().toISOString().split('T')[0];
    const { completed: checklistCompleted, total: checklistTotal } = getTodayChecklistProgress();
    markdown += `## ⭐ 今日の基本チェック\n\n`;
    markdown += `**進捗**: ${checklistCompleted}/${checklistTotal}\n\n`;
    
    customChecklistItems.forEach((item: any) => {
      const isChecked = dailyChecklist[today]?.[item.id] || false;
      const status = isChecked ? '✅' : '⬜';
      markdown += `- ${status} ${item.text}\n`;
    });
    markdown += `\n---\n\n`;

    categories.forEach(category => {
      markdown += `## ${category.title}\n\n`;
      
      category.items.forEach(subcategory => {
        const key = `${category.id}-${subcategory}`;
        const categoryTodos = todos[key] || [];
        const filteredTodos = getFilteredTodos(categoryTodos);
        
        if (filteredTodos.length > 0) {
          markdown += `### ${subcategory}\n\n`;
          
          filteredTodos.forEach((todo: any) => {
            const status = todo.completed ? '✅' : '⬜';
            markdown += `- ${status} ${todo.text}\n`;
            markdown += `  - 作成日時: ${todo.timestamp}\n`;
          });
          markdown += `\n`;
        }
      });
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tennis-note-${filterDate || 'all'}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-2xl">
              <span className="text-4xl">🎾</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              パーフェクトテニスノート
            </h1>
          </div>
          <p className="text-gray-300 mb-6 text-xl">
            テニスの技術向上を体系的に管理して、理想のプレイヤーを目指そう
          </p>
          
          {/* 統計情報 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-300">{getTotalTodos()}</div>
                  <div className="text-sm text-gray-400">総タスク数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">{getCompletedTodos()}</div>
                  <div className="text-sm text-gray-400">完了数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-300">{getProgressPercent()}%</div>
                  <div className="text-sm text-gray-400">進捗率</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
                  >
                    <Filter className="w-4 h-4" />
                    日付フィルタ
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showDateFilter && (
                    <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl p-4 z-10 min-w-48">
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          練習日で絞り込み
                        </label>
                        <select
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">すべての日付</option>
                          {getAvailableDates().map(date => (
                            <option key={date} value={date}>
                              {new Date(date).toLocaleDateString('ja-JP')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          setFilterDate('');
                          setShowDateFilter(false);
                        }}
                        className="w-full px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        リセット
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={exportToMarkdown}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  アウトプット
                </button>

                <button
                  onClick={clearAllData}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  データクリア
                </button>
              </div>
            </div>
            
            {filterDate && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 font-medium">
                    📅 {new Date(filterDate).toLocaleDateString('ja-JP')}の練習データを表示中
                  </span>
                  <button
                    onClick={() => setFilterDate('')}
                    className="text-blue-300 hover:text-blue-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${getProgressPercent()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 固定チェックリスト */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">今日の基本チェック</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-300">
                  {(() => {
                    const { completed, total } = getTodayChecklistProgress();
                    return `${completed}/${total} 完了`;
                  })()}
                </div>
                <button
                  onClick={() => setIsEditingChecklist(!isEditingChecklist)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-lg ${
                    isEditingChecklist 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isEditingChecklist ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {isEditingChecklist ? '保存' : '編集'}
                </button>
              </div>
            </div>
            
            {isEditingChecklist && (
              <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                    placeholder="新しいチェック項目を追加..."
                    className="flex-1 px-4 py-2 bg-white/90 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                  />
                  <button
                    onClick={addChecklistItem}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {customChecklistItems.map((item: any) => {
                const today = new Date().toISOString().split('T')[0];
                const isChecked = dailyChecklist[today]?.[item.id] || false;
                
                return (
                  <div
                    key={item.id}
                    className={`group relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                      isChecked 
                        ? 'bg-green-500/20 border-green-400/40 shadow-lg' 
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-yellow-400/50 cursor-pointer'
                    }`}
                  >
                    <div
                      onClick={() => !isEditingChecklist && toggleChecklistItem(item.id)}
                      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                        isChecked
                          ? 'bg-green-500 border-green-400 text-white shadow-lg'
                          : 'border-white/40 hover:border-yellow-400'
                      } ${!isEditingChecklist ? 'cursor-pointer' : ''}`}
                    >
                      {isChecked && <Check className="w-4 h-4" />}
                    </div>
                    
                    {isEditingChecklist ? (
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                        className="flex-1 bg-white/90 text-gray-800 px-2 py-1 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      <span
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`flex-1 font-medium select-none cursor-pointer ${
                          isChecked ? 'text-green-200 line-through' : 'text-white'
                        }`}
                      >
                        {item.text}
                      </span>
                    )}
                    
                    {isEditingChecklist && (
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ 
                    width: `${(() => {
                      const { completed, total } = getTodayChecklistProgress();
                      return total > 0 ? (completed / total) * 100 : 0;
                    })()}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* カテゴリー別セクション */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {categories.map(category => (
            <div key={category.id} className={`bg-gradient-to-br ${category.bgColor} backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20`}>
              <div className="flex items-center mb-6">
                <div className={`bg-gradient-to-r ${category.color} text-white p-3 rounded-xl mr-4 shadow-lg`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
              </div>

              {category.items.map(subcategory => {
                const key = `${category.id}-${subcategory}`;
                const categoryTodos = todos[key] || [];
                const filteredTodos = getFilteredTodos(categoryTodos);
                const completedCount = filteredTodos.filter((todo: any) => todo.completed).length;
                
                return (
                  <div key={subcategory} className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/40">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        {subcategory}
                      </h3>
                      {filteredTodos.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{completedCount}/{filteredTodos.length}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={inputValues[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, category.id, subcategory)}
                        placeholder={`${subcategory}の練習目標を入力...`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                      />
                      <button
                        onClick={() => addTodo(category.id, subcategory)}
                        className={`bg-gradient-to-r ${category.color} text-white px-4 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg`}
                      >
                        <Plus className="w-4 h-4" />
                        追加
                      </button>
                    </div>

                    <div className="space-y-2">
                      {filteredTodos.map((todo: any) => (
                        <div
                          key={todo.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                            todo.completed 
                              ? 'bg-green-50/80 border-green-200 shadow-sm backdrop-blur-sm' 
                              : 'bg-white/60 border-gray-200 hover:bg-white/80 hover:shadow-md backdrop-blur-sm'
                          }`}
                        >
                          <button
                            onClick={() => toggleTodo(category.id, subcategory, todo.id)}
                            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                              todo.completed
                                ? 'bg-green-500 border-green-500 text-white shadow-md'
                                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                            }`}
                          >
                            {todo.completed && <Check className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1">
                            <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {todo.text}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {todo.timestamp}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => deleteTodo(category.id, subcategory, todo.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {filteredTodos.length === 0 && categoryTodos.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-gray-400 italic">
                          まだ練習項目がありません<br />
                          目標を設定して始めましょう！
                        </p>
                      </div>
                    )}

                    {filteredTodos.length === 0 && categoryTodos.length > 0 && filterDate && (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📅</div>
                        <p className="text-gray-400 italic">
                          この日の練習項目はありません
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="text-center mt-12 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">継続は力なり</h3>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-gray-300">
            毎日少しずつでも進歩して、理想のテニスプレイヤーを目指しましょう！🏆
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerfectTennisNote;