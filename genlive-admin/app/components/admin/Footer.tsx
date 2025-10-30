export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white p-4">
      <p className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} GenLive Entertainment. All rights reserved.
      </p>
    </footer>
  );
}
