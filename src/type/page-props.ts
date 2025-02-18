type PageProps = {
  params: { ruleId: string; eventId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
