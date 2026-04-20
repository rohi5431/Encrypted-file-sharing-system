export default function CopyButton({ text }) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    alert("Link copied to clipboard ✅");
  };

  return (
    <button
      onClick={copy}
      className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
    >
      Copy
    </button>
  );
}
