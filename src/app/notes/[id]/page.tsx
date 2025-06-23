"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [note, setNote] = useState<{
    id: number;
    title: string;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (!id) return;

    fetch(`/api/notes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNote(data);
        setForm({ title: data.title, content: data.content });
        setLoading(false);
      });
  }, [id]);

  async function handleDeleteClick() {
    const res = await fetch(`/api/notes/${note?.id}/delete`, {
      method: "POST",
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Failed to delete note.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/notes/${id}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
  }

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <main className="max-w-xl mx-auto p-4">
      <Link
        href="/"
        className="text-sm text-blue-500 hover:underline block mb-4"
      >
        ← Home
      </Link>

      <form onSubmit={handleSubmit}>
        <input
          className="block w-full text-xl font-bold mb-4 border p-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="block w-full border p-2 mb-4"
          value={form.content}
          rows={5}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2 cursor-pointer"
        >
          Save
        </button>
      </form>

      <button
        onClick={handleDeleteClick}
        className="bg-red-600 text-white px-4 py-2 rounded mt-2"
      >
        Delete
      </button>
    </main>
  );
}
