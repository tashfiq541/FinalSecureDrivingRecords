'use client';
import axios from 'axios';
import { API_Key, API_Secret, secureDrivingRecords } from '@/app/constants/constant'
import { useState } from "react";
import { TransactionButton } from 'thirdweb/react';
import { client } from '../client';
import { sepolia } from 'thirdweb/chains';
import { getContract, prepareContractCall } from 'thirdweb';

type DriverProfile = {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    contactNumber: string;
    emailAddress: string;
    nid: string;
    residentialAddress: string;
    licenseNumber: string;
    licenseExpiryDate: string;
    licenseType: string;
    licenseImage: string;
    vehicleType: string;
    vehicleIN: string;
    vehiclePlateNumber: string;
    taxTokenNumber: string;
    taxTokenImage: string;
    profileImage: string;
    verified: boolean;
}

type DriverProfileProps = {
    driverProfile: DriverProfile;
    onClose: any;
}

const EditProfileForm = ({ driverProfile, onClose }: DriverProfileProps) => {
    
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: secureDrivingRecords,
    })

    const [contactNumber, setContactNumber] = useState(driverProfile.contactNumber);
    const [emailAddress, setEmailAddress] = useState(driverProfile.emailAddress);
    const [residentialAddress, setResidentialAddress] = useState(driverProfile.residentialAddress);
    const [licenseExpiryDate, setLicenseExpiryDate] = useState(driverProfile.licenseExpiryDate);
    const [vehicleType, setVehicleType] = useState(driverProfile.vehicleType);
    const [vehicleIN, setVehicleIN] = useState(driverProfile.vehicleIN);
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState(driverProfile.vehiclePlateNumber);
    const [taxTokenNumber, setTaxTokenNumber] = useState(driverProfile.taxTokenNumber);
    const [_taxTokenImage, setTaxTokenImage] = useState<File | null>(null);
    const [taxTokenImageUrl, setTaxTokenImageUrl] = useState(driverProfile.taxTokenImage);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const uploadToPinata = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: API_Key,
        pinata_secret_api_key: API_Secret,
        "Content-Type": "multipart/form-data",
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        // Call blockchain update function here
        try {
            if (_taxTokenImage) {
                const taxTokenImgUrl = await uploadToPinata(_taxTokenImage);
                setTaxTokenImageUrl(taxTokenImgUrl);
                console.log('Tax Token Image URL:', taxTokenImgUrl);
            }

            setIsModalOpen(true);

        } catch (error) {
            console.error("Error uploading images:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="loader">Loading...</div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md w-full max-w-4xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
                
                {/* Form Fields */}
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Contact Number</label>
            <input 
              name="_contactNumber" 
              type="tel" 
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter contact number" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Email Address</label>
            <input 
              name="_emailAddress" 
              type="email" 
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter email address" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Residential Address</label>
            <input 
              name="_residentialAddress" 
              type="text" 
              value={residentialAddress}
              onChange={(e) => setResidentialAddress(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter address" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">License Expiry Date</label>
            <input 
              name="_licenseExpiryDate" 
              type="date" 
              value={licenseExpiryDate}
              onChange={(e) => setLicenseExpiryDate(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Vehicle Type</label>
            <select 
              name="_vehicleType" 
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all"
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Motorbike">Motorbike</option>
              <option value="Microbus">Microbus</option>
              <option value="Pickup">Pickup</option>
              <option value="Bus">Bus</option>
              <option value="Three Wheeler">Three Wheeler</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Vehicle IN</label>
            <input 
              name="_vehicleIN" 
              type="text" 
              value={vehicleIN}
              onChange={(e) => setVehicleIN(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter vehicle identification number" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Vehicle Plate Number</label>
            <input 
              name="_vehiclePlateNumber" 
              type="text" 
              value={vehiclePlateNumber}
              onChange={(e) => setVehiclePlateNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter vehicle plate number" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Tax Token Number</label>
            <input 
              name="_taxTokenNumber" 
              type="text" 
              value={taxTokenNumber}
              onChange={(e) => setTaxTokenNumber(e.target.value)}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
              placeholder="Enter tax token number" 
            />
          </div>
                <div>
            <label className="text-gray-800 text-sm mb-2 block">Tax Token Image</label>
            <input 
              name="_taxTokenImage" 
              type="file" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setTaxTokenImage(e.target.files[0]);
                }
              }}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-blue-500 transition-all" 
            />
            
          </div>

                <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">Save Changes</button>
                <button type="button" onClick={onClose} className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
            </form>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"> {/* Darker overlay for better visibility */}
                    <div className="bg-white p-6 rounded-md shadow-md">
                    <h4 className="text-lg font-semibold mb-4 text-black">Confirm Profile Creation</h4>
                    <p className="text-gray-700">Are you sure you want to create this driver profile?</p> {/* Improved text color */}
                    <div className="flex justify-end mt-4">
                        <button
                        onClick={() => {
                            setIsModalOpen(false); // Close modal on cancel
                        }}
                        className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                        >
                        Cancel
                        </button>
                        <TransactionButton
                            transaction={() =>
                                prepareContractCall({
                                    contract,
                                    method: "function editDriverProfile(string _contactNumber, string _emailAddress, string _residentialAddress, string _licenseExpiryDate, string _vehicleType, string _vehicleIN, string _vehiclePlateNumber, string _taxTokenNumber, string _taxTokenImage)",
                                    params: [contactNumber, emailAddress, residentialAddress, licenseExpiryDate, vehicleType, vehicleIN, vehiclePlateNumber, taxTokenNumber, taxTokenImageUrl]
                                })
                            }
                            onError={(error) => alert(`Error:${error.message}`)}
                                onTransactionConfirmed={async () => {
                                    alert("Profile Edited.");
                                    setIsModalOpen(false);
                                    onClose();
                                }}
                        >
                        Confirm
                        </TransactionButton>
                    </div>
                    </div>
                </div>
                )}
        </div>
    );
};

export default EditProfileForm;
