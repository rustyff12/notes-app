"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<{
    id: number;
    title: string;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    fetch(`/api/notes/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setNote(data);
        setForm({ title: data.title, content: data.content });
        setLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/notes/${params.id}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.refresh();
  };

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <main className="max-w-xl mx-auto p-4">
      <Link href="/" className="text-blue-600 hover:underline block mb-4">
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
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Save
        </button>
      </form>

      <button
        onClick={async () => {
          const confirmed = confirm(
            "Are you sure you want to delete this note?"
          );
          if (!confirmed) return;

          await fetch(`/api/notes/${note.id}/delete`, {
            method: "POST",
          });

          router.push("/");
        }}
        className="bg-red-600 text-white px-4 py-2 rounded mt-2"
      >
        Delete
      </button>
    </main>
  );
}
