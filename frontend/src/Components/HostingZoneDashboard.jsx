import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";

import CreateDomain from "./CreateDomainpopup";
import UpdateDNSRecord from "./updateDNSpopup";
import { listDomains, createDomain, deleteDomain } from "../APIs/domainAPIs";
import { useNavigate } from "react-router-dom";

const Table = ["Name", "Records"];

function HostingZoneDashboard() {
  const [domainEntries, setdomainEntries] = useState([]);
  const [isCreateOrUpdateDNSRecordOpen, setIsCreateOrUpdateDNSRecordOpen] =
    useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filtereddomainEntries = domainEntries.filter((record) =>
    record.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const data = await listDomains();
      setdomainEntries(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrUpdateDomain = async (recordData, ttl) => {
    try {
      if (recordToUpdate) {
        await updateDomain(recordToUpdate.id, recordData, ttl);
      } else {
        console.log(recordData);
        await createDomain(recordData);
      }
      fetchDomains();
      setIsCreateOrUpdateDNSRecordOpen(false); // Close the popup after successful creation or update
      setRecordToUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDomain = (record) => {
    setRecordToUpdate(record);
    setIsCreateOrUpdateDNSRecordOpen(true);
  };

  const handleDeleteDomain = async (domainId) => {
    try {
      const hostedZoneId = domainId.split("/").pop();
      await deleteDomain(hostedZoneId);
      fetchDomains(); // Refresh Domains after deletion
    } catch (error) {
      console.error(error);
    }
  };

  const handleviewRecords = (hostedZoneId, domainName) => {
    console.log(hostedZoneId);
    const domainId = hostedZoneId.split("/").pop(); // Extract the domain ID
    navigate(`/records?code=${encodeURIComponent(domainId)}`, { state: { title: domainName } });
  };
  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between mb-4 ">
            <div className="w-1/3">
              <Button
                className="flex items-center gap-3 bg-purple-500 text-white"
                size="sm"
                onClick={() => setIsCreateOrUpdateDNSRecordOpen(true)}
              >
                Create Domain
              </Button>
            </div>

            <div className="w-2/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-gray-300 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <svg
                  className="absolute left-3 top-2 h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 17l-4 4m0 0l-4-4m4 4V3"
                  />
                </svg>
              </div>
            </div>


          </div>
        </CardHeader>

        <CardBody className="overflow-scroll px-0">
          
          <table className="mt-4 w-full min-w-max table-auto text-left rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                {Table.map((head) => (
                  <th
                    key={head}
                    className="border-b border-gray-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
                <th className="border-b border-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {domainEntries?.length > 0 ? (
                domainEntries.map((record, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.Name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ResourceRecordSetCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {record.ResourceRecordSetCount <= 2 ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateDNSRecord(record)}
                            className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:bg-green-600"
                          >
                            Update
                          </button>


                          <button
                            onClick={() => handleDeleteDomain(record.Id)}
                            className="px-3 py-1 text-sm rounded-md bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:from-gray-600 focus:to-gray-700"
                          >
                            Delete
                          </button>


                        </div>
                      ) : (
                        <p className="text-sm text-red-500">You can delete Zone only after deleting all records</p>
                      )}
                      <button
                        onClick={() => handleviewRecords(record.Id, record.Name)}
                        className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600"
                      >
                        View Records
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={Table.length + 1} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    No DNS records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


        </CardBody>

        {/* Render the CreateDNSRecord component as a popup */}
        {isCreateOrUpdateDNSRecordOpen && (
          <CreateDomain
            onSubmit={handleCreateOrUpdateDomain}
            onClose={() => setIsCreateOrUpdateDNSRecordOpen(false)}
          />
        )}

        {/* Render the UpdateDNSRecord component as a popup */}
        {recordToUpdate && (
          <UpdateDNSRecord
            initialDomainName={recordToUpdate.Name}
            initialRecordType={recordToUpdate.Type}
            initialRecordValue={recordToUpdate.ResourceRecords[0].Value}
            initialTTL={recordToUpdate.TTL}
            onSubmit={handleCreateOrUpdateDNSRecord}
            onClose={() => {
              setIsCreateOrUpdateDNSRecordOpen(false);
              setRecordToUpdate(null);
            }}
          />
        )}
      </Card>
    </>
  );
}

export default HostingZoneDashboard;
