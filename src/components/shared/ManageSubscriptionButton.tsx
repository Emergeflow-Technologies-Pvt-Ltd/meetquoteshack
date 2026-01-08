"use client";

export default function ManageSubscriptionButton() {
  return (
    <button
      onClick={async () => {
        try {
          const res = await fetch("/api/billing/portal", {
            method: "POST",
          });

          const data = await res.json();

          if (data.url) {
            window.location.href = data.url;
          } else {
            alert("Unable to open billing portal");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong");
        }
      }}
      className="rounded-md border px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50"
    >
      Manage Subscription
    </button>
  );
}
