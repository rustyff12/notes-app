"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const newNote = await res.json();
    setNotes([newNote, ...notes]); // prepend
    setTitle("");
    setContent("");
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📝 Notes</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          className="border p-2 w-full mb-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note.id} className="border p-3 mb-2 rounded hover:shadow">
            <Link href={`/notes/${note.id}`}>
              <h3 className="font-semibold text-blue-600 hover:underline">
                {note.title}
              </h3>
              <p className="text-gray-800">{note.content}</p>
              <small className="text-gray-500">
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
