import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/account/signin",
      redirect: true,
    });
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]"
      style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
    >
      <div className="w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-8">
        <div className="flex items-center justify-center mb-8">
          <img
            src="https://ucarecdn.com/f5ae1e2c-7229-43a4-a8ad-ae05a4f4cac4/-/format/auto/"
            alt="Logo Papua Barat Daya"
            className="h-20 w-20 object-contain"
          />
        </div>

        <h1 className="text-2xl font-semibold text-[#111827] tracking-tight text-center mb-2">
          Keluar dari Sistem
        </h1>
        <p className="text-sm text-[#6B7280] text-center mb-8">
          Anda yakin ingin keluar dari S-Kepegawaian?
        </p>

        <button
          onClick={handleSignOut}
          className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
