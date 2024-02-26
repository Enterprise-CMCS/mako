import { useGetAllForms } from "@/api";
import { Link } from "@/components";
import { SubNavHeader } from "../Layout";
import { LoadingSpinner } from "../LoadingSpinner";

export const WebformsList = () => {
  const { data, isLoading } = useGetAllForms();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <SubNavHeader>
        <h1 className="text-xl font-medium">Webforms</h1>
      </SubNavHeader>
      <section className="block md:flex md:flex-row max-w-screen-xl m-auto px-4 lg:px-8 pt-8 gap-10">
        <div>
          <table className="table-auto">
            <thead>
              <tr>
                <th>Form</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                Object.entries(data).map(([key, versions]) =>
                  versions.map((version) => (
                    <tr key={`${key}-${version}`}>
                      <td>{key}</td>
                      <td>{version}</td>
                      <td>
                        <Link
                          className="cursor-pointer text-blue-600"
                          path="/webform/:id/:version"
                          params={{ id: key.toLowerCase(), version: version }}
                        >
                          link
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>

          <div className="mt-2">
            <Link
              className="cursor-pointer text-blue-600 ml-0"
              path="/guides/abp"
            >
              Implementation Guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
