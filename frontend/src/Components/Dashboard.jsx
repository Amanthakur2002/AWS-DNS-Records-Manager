import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import {
  listHostedZones,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
} from "../APIs/dnsAPIs"; // Import API functions
import { UserPlusIcon } from "@heroicons/react/24/solid";
import CreateDNSRecord from "./createDNSpopup";
import UpdateDNSRecord from "./updateDNSpopup";
import { ToastContainer } from "react-toastify";
import { useNavigate ,useLocation} from "react-router-dom";


const TABLE_HEAD = ["Domain Name", "Type", "Value", ""];

function Dashboard() {
  const [dnsRecords, setDNSRecords] = useState([]);
  const [isCreateOrUpdateDNSRecordOpen, setIsCreateOrUpdateDNSRecordOpen] =
    useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  console.log(code)
  const navigate = useNavigate();
  const location = useLocation();
  const { title } = location.state || {};

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // const filteredDNSRecords = dnsRecords.filter((record) =>
  //   record.Name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  useEffect(() => {
    fetchDNSRecords();
  }, []);

  const fetchDNSRecords = async () => {
    try {
      console.log('code in fetch',code)
      const data = await listHostedZones(code);
      setDNSRecords(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOrUpdateDNSRecord = async (recordData, ttl) => {
    try {
      if (recordToUpdate) {
        await updateDNSRecord(recordToUpdate.id, recordData, ttl, code);
      } else {
        await createDNSRecord(recordData, code);
      }
      fetchDNSRecords();
      setIsCreateOrUpdateDNSRecordOpen(false); // Close the popup after successful creation or update
      setRecordToUpdate(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDNSRecord = (record) => {
    setRecordToUpdate(record);
    setIsCreateOrUpdateDNSRecordOpen(true);
  };

  const handleDeleteDNSRecord = async (record) => {
    try {
      console.log('code in delete - ', code)
      await deleteDNSRecord(record.id, record, code);
      fetchDNSRecords(); // Refresh DNS records after deletion
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between mb-4 ">
            <div className="w-1/3">
              <div className="flex flex-row justify-center p-4 mr-4">
                <Button
                  className="flex items-center gap-3 mr-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                  size="sm"
                  onClick={() => setIsCreateOrUpdateDNSRecordOpen(true)}
                >
                  Create Record
                </Button>



                <Button
                  className="flex items-center gap-3"
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Back to Zones
                </Button>
              </div>
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
          <div className="flex items-center justify-center text-4xl text-black p-4">
            <h1>Domain : <b>{title}</b></h1>
          </div>


        </CardHeader>

        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left border-collapse rounded-lg overflow-hidden">
            <thead className="bg-purple-700 text-white">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border border-purple-700 p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
                <th className="border border-purple-700 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {dnsRecords?.length > 0 ? (
                (console.log(dnsRecords),
                  dnsRecords.map((record, index) => (
                    <tr key={index} className="bg-purple-50">
                      <td className="p-4 border border-purple-700">{record.Name}</td>
                      <td className="p-4 border border-purple-700">{record.Type}</td>
                      <td className="p-4 border border-purple-700">{record.ResourceRecords[0].Value}</td>
                      <td className="p-4 border border-purple-700">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdateDNSRecord(record)}
                            size="sm"
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md focus:outline-none"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => handleDeleteDNSRecord(record)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md focus:outline-none"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )))
              ) : (
                <tr>
                  <td colSpan={TABLE_HEAD.length + 1} className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      No DNS records available.
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </CardBody>

        {/* Render the CreateDNSRecord component as a popup */}
        {isCreateOrUpdateDNSRecordOpen && (
          <CreateDNSRecord
            onSubmit={handleCreateOrUpdateDNSRecord}
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

export default Dashboard;






