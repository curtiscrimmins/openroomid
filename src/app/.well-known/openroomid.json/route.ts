export function GET() {
  return Response.json(
    {
      standard: "OpenRoomID",
      registrar: "The OpenRoomID Project",
      records_license: "CC0-1.0",
      spec_license: "CC-BY-4.0",
      spec_version: "1.0",
      spec_url: "https://openroomid.org/spec/1.0",
      resolver_base: "https://openroomid.org/",
      contact: "registry@openroomid.org",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
