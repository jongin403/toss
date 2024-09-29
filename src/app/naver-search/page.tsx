"use client";

import { useQuery } from "@tanstack/react-query";

const API_URL = "/api/naver-search";

interface SearchParams {
  startDate: string;
  endDate: string;
  timeUnit: string;
  keywordGroups: {
    groupName: string;
    keywords: string[];
  }[];
}

interface ApiResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

const handleSearch = async (
  searchQuery: SearchParams,
): Promise<ApiResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchQuery),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
};

interface RenderContentProps {
  data: ApiResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

const RenderContent: React.FC<RenderContentProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const NaverSearch: React.FC = () => {
  // 검색 조건을 설정
  const searchParams = {
    startDate: "2023-01-01",
    endDate: "2023-09-30",
    timeUnit: "month",
    keywordGroups: [
      {
        groupName: "example",
        keywords: ["example", "sample"],
      },
    ],
  };

  // React Query를 사용해 데이터 fetching
  const { data, error, isLoading } = useQuery({
    queryKey: ["naver-search", searchParams], // 검색 조건에 따라 캐싱됨
    queryFn: () => handleSearch(searchParams), // 검색 조건을 전달
  });

  return <RenderContent data={data} isLoading={isLoading} error={error} />;
};

export default NaverSearch;
