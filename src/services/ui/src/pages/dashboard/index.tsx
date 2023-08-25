import * as UI from "@enterprise-cmcs/macpro-ux-lib";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { getUser, useGetUser } from "@/api/useGetUser";
import { WaiversList } from "./Lists/waivers";
import { SpasList } from "./Lists/spas";
import { getUserStateCodes } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useParams } from "@/hooks";

const loader = (queryClient: QueryClient) => {
  return async () => {
    if (!queryClient.getQueryData(["user"])) {
      await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: () => getUser(),
      });
    }

    const isUser = queryClient.getQueryData(["user"]) as Awaited<
      ReturnType<typeof getUser>
    >;
    if (!isUser.user) {
      return redirect("/");
    }

    return isUser;
  };
};
export const dashboardLoader = loader;

const StateSelector = ({
  selectedState,
  handleStateChange,
  userStateCodes,
}: {
  selectedState: string;
  handleStateChange: ChangeEventHandler<HTMLSelectElement>;
  userStateCodes: string[];
}) => {
  if (userStateCodes.length === 1) {
    return null;
  }

  return (
    <div>
      <label htmlFor="state-select">Select a state: </label>
      <select
        id="state-select"
        value={selectedState}
        onChange={handleStateChange}
      >
        {userStateCodes.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Dashboard = () => {
  const params = useParams<{ value: "spas" | "waivers" }>({
    key: "tab",
    initValue: { value: "spas" },
  });

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
      <div className="flex items-center justify-between my-4">
        <UI.Typography size="lg" as="h1">
          Dashboard
        </UI.Typography>
      </div>
      <div className="w-[100%] items-center justify-center">
        <Tabs
          value={params.state.value}
          onValueChange={(value) =>
            params.onSet(() => ({ value: value as any }), true)
          }
        >
          <TabsList>
            <TabsTrigger value="spas" className="px-6 py-2">
              <UI.Typography
                size="md"
                className="font-bold text-[1.3em]"
                as="h1"
              >
                Spas
              </UI.Typography>
            </TabsTrigger>
            <TabsTrigger value="waivers" className="px-6 py-2">
              <UI.Typography
                size="md"
                className="font-bold text-[1.3em]"
                as="h1"
              >
                Waivers
              </UI.Typography>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="spas">
            {/* this is to prevent rendering when not in view (stop os request) */}
            {params.state.value === "spas" && <SpasList />}
          </TabsContent>
          <TabsContent value="waivers">
            {/* this is to prevent rendering when not in view (stop os request) */}
            {params.state.value === "waivers" && <WaiversList />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
