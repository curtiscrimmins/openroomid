export function GET() {
  return Response.json(
    {
      standard: "Open Room ID",
      spec_version: "1.0",
      spec_url: "https://openroomid.org/spec/1.0",
      resolver_base: "https://openroomid.org/",
      contact: "curtis@roomza.com",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
