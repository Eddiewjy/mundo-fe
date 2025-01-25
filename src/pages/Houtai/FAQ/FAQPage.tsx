import React, { useState, useEffect } from "react";
import styles from "../Houtai.module.css"; // 引入CSS模块
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/router/api";

interface FAQData {
  question: string;
  answers: string;
  isEditing: boolean;
}

export default function FAQPage() {
  const [faqData, setFaqData] = useState([] as FAQData[]);

  // 编辑功能
  const handleEdit = (index: number) => {
    setFaqData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isEditing: true } : item))
    );
  };

  // 保存功能
  const handleSave = async (
    index: number,
    updatedQuestion: string,
    updatedAnswer: string
  ) => {
    try {
      const item = faqData[index];
      await updateQuestion(item.question, updatedQuestion, updatedAnswer);
      setFaqData((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                question: updatedQuestion,
                answers: updatedAnswer,
                isEditing: false,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update question", error);
    }
  };

  // 删除功能
  const handleDelete = async (index: number) => {
    try {
      const item = faqData[index];
      await deleteQuestion(item.question);
      setFaqData((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };

  // 添加功能
  const handleAdd = async () => {
    try {
      const newQuestion = await createQuestion("", "");
      setFaqData((prev) => [...prev, { ...newQuestion, isEditing: true }]);
    } catch (error) {
      console.error("Failed to create question", error);
    }
  };

  // 问题列表
  const fetchQuestions = async () => {
    try {
      const fetchedQuestions = await getQuestions();
      console.log("问题列表访问成功");
      setFaqData(
        fetchedQuestions.map((q: any) => ({ ...q, isEditing: false }))
      );
    } catch (error) {
      alert("问题列表访问失败");
      console.error("Failed to fetch questions", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div>
      <div className={styles.faqContainer}>
        <h2 className="mb-4 text-lg font-semibold">FAQ</h2>
        <button onClick={handleAdd} className={styles.faqButton}>
          添加问题
        </button>
        {faqData.map((item, index) =>
          item.isEditing ? (
            <div key={index} className={styles.faqItem}>
              <div>
                <label>问题: </label>
                <input
                  type="text"
                  defaultValue={item.question}
                  className="p-1 mr-2 border"
                  onChange={(e) => (item.question = e.target.value)}
                />
              </div>
              <div>
                <label>回答: </label>
                <input
                  type="text"
                  defaultValue={item.answers}
                  className="p-1 mr-2 border"
                  onChange={(e) => (item.answers = e.target.value)}
                />
              </div>
              <button
                onClick={() => handleSave(index, item.question, item.answers)}
                className={styles.faqButton}
              >
                保存
              </button>
              <button
                onClick={() => handleDelete(index)}
                className={styles.faqButton}
              >
                删除
              </button>
            </div>
          ) : (
            <div key={index} className={styles.faqItem}>
              <p className={styles.faqText}>问题: {item.question}</p>
              <p className={styles.faqText}>回答: {item.answers}</p>
              <button
                onClick={() => handleEdit(index)}
                className={styles.faqButton}
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(index)}
                className={styles.faqButton}
              >
                删除
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
