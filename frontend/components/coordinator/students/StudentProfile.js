import { useEffect, useState, useContext } from "react"
import StudentDocs from "@/components/student/StudentDocs";
import { toast } from "react-toastify";
import AuthContext from '@/context/AuthContext';
import { API_URL } from "@/config/index";
import { PaperClipIcon } from "@heroicons/react/solid";
// import Image from 'next/image'
export default function StudentProfileEdit({ token = "", student }) {
  const id = student.id;
  // const {
  //   createdAt,
  //   resume_link,
  //   updatedAt,
  //   user_relation,
  //   program,
  //   course,
  //   resume,
  //   profile_pic,
  //   placed_status,
  //   ...newStudent
  // } = student.attributes;
  const {
    createdAt,
    resume_link,
    updatedAt,
    user_relation,
    program,
    course,
    profile_pic,
    resume,
    casteCertificate, // here all the uploading docs destructuring is done such after api call i wont give internal server error
    disabilityCertificate,
    drivingLicence,
    panCard,
    tenthCertificate,
    twelthCertificate,
    allSemMarksheet,
    aadharCard,
    department,
    lastUpdatedBy,
    ...newStudent
  } = student.attributes;

  const [values, setValues] = useState(newStudent);

  const {handleLastUpdatedBy} = useContext(AuthContext);

  // const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  //get courses of selected program

  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    setCourses([course?.data?.attributes?.course_name]);
    setPrograms([program?.data?.attributes?.program_name]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    // const hasEmptyFields = Object.values(values).some((element) => {
    //   element === ''

    // })

    // console.log("ID=>",id ,typeof(id) );
    // console.log(JSON.stringify({ data: values }))
    // id = String(id)
    // console.log("ID=>",id ,typeof(id) );

    if (confirm("Are you sure you want to edit student profile?")) {
      // @important lastUpdateBy should be called before this api call its important to save logs first and then do changes in student profile
      if (!(await handleLastUpdatedBy({ selectedStudentId: id, token: token }))) {
        toast.error("Something went wrong");
        console.log("Unable to update logs in student profile");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/students/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: values }),
        });

        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            toast.error("No token included");
            return;
          }

          const profile = await res.json();
          toast.error(profile?.error.name);
        } else {
          const profile = await res.json();
          toast.success("Profile Edited Successfully");
        }
      } catch (e) {
        console.log("Error while editing: ", e);
      }
    }
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 mt-4">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Student Personal Information, account will be active after your
                approval.
                <img
                  alt="Profile Picture"
                  src={`${API_URL}${student?.attributes?.profile_pic?.data?.attributes?.url}`}
                />
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="approved"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    disabled
                    name="approved"
                    id="approved"
                    className="block w-full px-3 py-2 rounded-md text-gray-700 bg-white border border-red-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    value={values.approved}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="placed_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Placed Status( For Off-Campus &amp; PPO Offers )
                  </label>
                  <select
                    disabled
                    name="placed_status"
                    id="placed_status"
                    className="block w-full px-3 py-2 rounded-md text-gray-700 bg-white border border-red-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    value={values.placed_status}
                    onChange={handleInputChange}
                  >
                    <option value="unplaced">Not Placed</option>
                    <option value="placed_tier1">Placed in Tier1</option>
                    <option value="placed_tier2">Placed in Tier2</option>
                    <option value="placed_tier3">Placed in Tier3</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="internship_status_2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Internship Status (2 Month)
                  </label>
                  <select
                    name="internship_status_2"
                    id="internship_status_2"
                    className="block w-full px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    value={values.internship_status_2}
                    onChange={handleInputChange}
                  >
                    <option value="false">Not Got Internship</option>
                    <option value="true">Got Internship</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="internship_status_6_m"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Internship Status (6 Month)
                  </label>
                  <select
                    name="internship_status_6_m"
                    id="internship_status_6_m"
                    className="block w-full px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    value={values.internship_status_6}
                    onChange={handleInputChange}
                  >
                    <option value="false">Not Got Internship</option>
                    <option value="true">Got Internship</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="fte_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    FTE Status
                  </label>
                  <select
                    name="fte_status"
                    id="fte_status"
                    className="block w-full px-3 py-2 rounded-md text-gray-700 bg-white border border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    value={values.fte_status}
                    onChange={handleInputChange}
                  >
                    <option value="false">Not Got FTE</option>
                    <option value="true">Got FTE</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    disabled
                    value={values.name}
                    onChange={handleInputChange}
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="roll"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Roll No.
                  </label>
                  <input
                    disabled
                    value={values.roll}
                    onChange={handleInputChange}
                    type="text"
                    name="roll"
                    id="roll"
                    autoComplete="roll"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-9 sm:col-span-3">
                  <label
                    htmlFor="father_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father&apos;s Name
                  </label>
                  <input
                    disabled
                    value={values.father_name}
                    onChange={handleInputChange}
                    type="text"
                    name="father_name"
                    id="father_name"
                    autoComplete="father_name"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-9 sm:col-span-3">
                  <label
                    htmlFor="father_occupation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father&apos;s Occupation
                  </label>
                  <input
                    disabled
                    value={values.father_occupation}
                    onChange={handleInputChange}
                    type="text"
                    name="father_occupation"
                    id="father_occupation"
                    autoComplete="father_occupation"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-9 sm:col-span-3">
                  <label
                    htmlFor="mother_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mother&apos;s Name
                  </label>
                  <input
                    disabled
                    value={values.mother_name}
                    onChange={handleInputChange}
                    type="text"
                    name="mother_name"
                    id="mother_name"
                    autoComplete="mother_name"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-9 sm:col-span-3">
                  <label
                    htmlFor="mother_occupation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mother&apos;s Occupation
                  </label>
                  <input
                    disabled
                    value={values.mother_occupation}
                    onChange={handleInputChange}
                    type="text"
                    name="mother_occupation"
                    id="mother_occupation"
                    autoComplete="mother_occupation"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="personal_email_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Personal Email
                  </label>
                  <input
                    disabled
                    value={values.personal_email_id}
                    onChange={handleInputChange}
                    type="text"
                    name="personal_email_id"
                    id="personal_email_id"
                    autoComplete="email"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="institute_email_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Institute Email
                  </label>
                  <input
                    disabled
                    value={values.institute_email_id}
                    onChange={handleInputChange}
                    type="text"
                    name="institute_email_id"
                    id="institute_email_id"
                    autoComplete="email"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="mobile_number_1"
                    className="block text-sm font-medium text-gray-700"
                    required
                  >
                    Mobile Number 1
                  </label>
                  <input
                    disabled
                    value={values.mobile_number_1}
                    onChange={handleInputChange}
                    type="text"
                    name="mobile_number_1"
                    id="mobile_number_1"
                    autoComplete="tel-national"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="mobile_number_2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number 2
                  </label>
                  <input
                    disabled
                    value={values.mobile_number_2}
                    onChange={handleInputChange}
                    type="text"
                    name="mobile_number_2"
                    id="mobile_number_2"
                    autoComplete="tel-national"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    disabled
                    value={values.gender}
                    onChange={handleInputChange}
                    id="gender"
                    name="gender"
                    autoComplete="gender"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-red-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option>Select</option>
                    <option>female</option>
                    <option>male</option>
                    <option>other</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    disabled
                    value={values.category}
                    onChange={handleInputChange}
                    id="category"
                    name="category"
                    autoComplete="category"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-red-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="ews">EWS</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="pwd"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PWD
                  </label>
                  <select
                    disabled
                    value={values.pwd}
                    onChange={handleInputChange}
                    id="pwd"
                    name="pwd"
                    autoComplete="pwd"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-red-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option>Select</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                <div className="col-span-9 sm:col-span-3">
                  <label
                    htmlFor="type_of_disability"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type Of Disability (If PWD)
                  </label>
                  <input
                    disabled
                    value={values.type_of_disability}
                    type="text"
                    name="type_of_disability"
                    id="type_of_disability"
                    autoComplete="type_of_disability"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-blue-900 "
                  />
                </div>

                <div className="col-span-9 sm:col-span-3">
                  <label
                    htmlFor="disability_percentage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Disability Percentage (If PWD)
                  </label>
                  <input
                    disabled
                    value={values.disability_percentage}
                    type="text"
                    name="disability_percentage"
                    id="disability_percentage"
                    autoComplete="disability_percentage"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-blue-900 "
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="disability_certificate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Disability Certificate (IF PWD)
                  </label>
                  <input
                    disabled
                    value={values.disability_certificate}
                    onChange={handleInputChange}
                    type="text"
                    name="disability_certificate"
                    id="disability_certificate"
                    autoComplete="disability_certificate"
                    placeholder="Drive Link"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="date_of_birth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <input
                    disabled
                    value={values.date_of_birth}
                    onChange={handleInputChange}
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    autoComplete="date_of_birth"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="blood_group"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Blood Group
                  </label>
                  <input
                    disabled
                    value={values.blood_group}
                    onChange={handleInputChange}
                    type="text"
                    name="blood_group"
                    id="blood_group"
                    autoComplete="blood_group"
                    placeholder="E.g- A+"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Height
                  </label>
                  <input
                    disabled
                    value={values.height}
                    onChange={handleInputChange}
                    type="text"
                    name="height"
                    id="height"
                    autoComplete="height"
                    placeholder="In cm (E.g 68.9)"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Weight
                  </label>
                  <input
                    disabled
                    value={values.weight}
                    onChange={handleInputChange}
                    type="text"
                    name="weight"
                    id="weight"
                    autoComplete="weight"
                    placeholder="In Kg (E.g - 58)"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Permanent Address
                  </label>
                  <textarea
                    disabled
                    value={values.address}
                    onChange={handleInputChange}
                    rows={4}
                    name="address"
                    id="address"
                    autoComplete="address"
                    required
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="domicile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Domicile
                  </label>
                  <input
                    disabled
                    value={values.domicile}
                    onChange={handleInputChange}
                    type="text"
                    name="domicile"
                    id="domicile"
                    autoComplete="domicile"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    disabled
                    value={values.city}
                    onChange={handleInputChange}
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="city"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    disabled
                    value={values.state}
                    onChange={handleInputChange}
                    type="text"
                    name="state"
                    id="state"
                    autoComplete="state"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="pin_code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PIN CODE
                  </label>
                  <input
                    disabled
                    value={values.pin_code}
                    onChange={handleInputChange}
                    type="text"
                    name="pin_code"
                    id="pin_code"
                    autoComplete="pin_code"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="correspondance_address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Correspondence Address
                  </label>
                  <input
                    disabled
                    value={values.correspondance_address}
                    onChange={handleInputChange}
                    type="text"
                    name="correspondance_address"
                    id="correspondance_address"
                    autoComplete="correspondance_address"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="aadhar_no"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Aadhar No
                  </label>
                  <input
                    disabled
                    value={values.aadhar_no}
                    onChange={handleInputChange}
                    type="text"
                    name="aadhar_no"
                    id="aadhar_no"
                    autoComplete="aadhar_no"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="driving_licience_no"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Driving Licence No
                  </label>
                  <input
                    disabled
                    value={values.driving_licience_no}
                    onChange={handleInputChange}
                    type="text"
                    name="driving_licience_no"
                    id="driving_licience_no"
                    autoComplete="driving_licience_no"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="driving_licience_link"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Driving Licence
                  </label>
                  <input
                    disabled
                    value={values.driving_licience_link}
                    onChange={handleInputChange}
                    type="text"
                    name="driving_licience_link"
                    id="driving_licience_link"
                    autoComplete="driving_licience_link"
                    placeholder="Drive Link"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="pancard_no"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pan Card No
                  </label>
                  <input
                    disabled
                    value={values.pancard_no}
                    onChange={handleInputChange}
                    type="text"
                    name="pancard_no"
                    id="pancard_no"
                    autoComplete="pancard_no"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Academic Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Student Academic Information, account will be active after admin
                approval.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="rank"
                    className="block text-sm font-medium text-gray-700"
                  >
                    GATE / JEE / JAM Rank
                  </label>
                  <input
                    disabled
                    value={values.rank}
                    onChange={handleInputChange}
                    type="number"
                    name="rank"
                    id="rank"
                    autoComplete="rank"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="categoryRank"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category Rank
                  </label>
                  <input
                    disabled
                    value={values.categoryRank}
                    onChange={handleInputChange}
                    type="number"
                    name="categoryRank"
                    id="categoryRank"
                    autoComplete="categoryRank"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                {/* 
                <div className='col-span-6 sm:col-span-3'>
                  <label
                    htmlFor='registered_for'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Registering for
                  </label>
                  <select
                    disabled
                    value={values.registered_for}
                    onChange={handleInputChange}
                    id='registered_for'
                    name='registered_for'
                    autoComplete='registered_for'
                    required
                    className='mt-1 block w-full py-2 px-3 border border-red-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
                  >
                    <option>Select</option>
                    <option>Internship</option>
                    <option>FTE</option>
                  </select>
                </div>
 */}

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="program"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Program
                  </label>
                  <select
                    // onClick={setCourseAndP/rogram}
                    disabled
                    value={program}
                    onChange={handleInputChange}
                    id="program"
                    name="program"
                    autoComplete="program"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-red-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    {/* <option>Select</option> */}
                    {programs.map((program) => {
                      return (
                        <option key={program.id} value={program.id}>
                          {program}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course
                  </label>
                  <select
                    disabled
                    value={course}
                    onChange={handleInputChange}
                    id="course"
                    name="course"
                    autoComplete="course"
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    {/* <option>Select</option> */}
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-1
                  </label>
                  <input
                    disabled
                    value={values.spi_1}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_1"
                    id="spi_1"
                    autoComplete="spi_1"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-2
                  </label>
                  <input
                    disabled
                    value={values.spi_2}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_2"
                    id="spi_2"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_3"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-3
                  </label>
                  <input
                    disabled
                    value={values.spi_3}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_3"
                    id="spi_3"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_4"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-4
                  </label>
                  <input
                    disabled
                    value={values.spi_4}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_4"
                    id="spi_4"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_5"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-5
                  </label>
                  <input
                    disabled
                    value={values.spi_5}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_5"
                    id="spi_5"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_6"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-6
                  </label>
                  <input
                    disabled
                    value={values.spi_6}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_6"
                    id="spi_6"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_7"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-7
                  </label>
                  <input
                    disabled
                    value={values.spi_7}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_7"
                    id="spi_7"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="spi_8"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-8
                  </label>
                  <input
                    disabled
                    value={values.spi_8}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="spi_8"
                    id="spi_8"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="spi_9"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-9
                  </label>
                  <input
                    disabled
                    value={values.spi_9}
                    onChange={handleInputChange}
                    type="number"
                    min={2}
                    max={10}
                    step=".01"
                    placeholder="Ex: 8.86"
                    name="spi_9"
                    id="spi_9"
                    autoComplete="spi_9"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="spi_9"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-9
                  </label>
                  <input
                    disabled
                    value={values.spi_9}
                    onChange={handleInputChange}
                    type="number"
                    min={2}
                    max={10}
                    step=".01"
                    placeholder="Ex: 8.86"
                    name="spi_9"
                    id="spi_9"
                    autoComplete="spi_9"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="spi_9"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA-10
                  </label>
                  <input
                    disabled
                    value={values.spi_10}
                    onChange={handleInputChange}
                    type="number"
                    min={2}
                    max={10}
                    step=".01"
                    placeholder="Ex: 8.86"
                    name="spi_9"
                    id="spi_9"
                    autoComplete="spi_9"
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="cpi"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Overall CGPA
                  </label>
                  <input
                    disabled
                    value={values.cpi}
                    onChange={handleInputChange}
                    type="number"
                    max={10}
                    name="cpi"
                    id="cpi"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-5 sm:col-span-2">
                  <label
                    htmlFor="X_board"
                    className="block text-sm font-medium text-gray-700"
                  >
                    X Board
                  </label>
                  <input
                    disabled
                    value={values.X_board}
                    onChange={handleInputChange}
                    type="text"
                    name="X_board"
                    id="X_board"
                    // min={33}
                    // max={100}
                    // step='.01'
                    autoComplete="X_board"
                    // placeholder='In percentage Ex: 88.5'
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="X_YOP"
                    className="block text-sm font-medium text-gray-700"
                  >
                    X Year Of Passing
                  </label>
                  <input
                    disabled
                    value={values.X_YOP}
                    onChange={handleInputChange}
                    type="text"
                    name="X_YOP"
                    id="X_YOP"
                    autoComplete="X_YOP"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="X_marks"
                    className="block text-sm font-medium text-gray-700"
                  >
                    X Marks
                  </label>
                  <input
                    disabled
                    value={values.X_marks}
                    onChange={handleInputChange}
                    type="number"
                    name="X_marks"
                    id="X_marks"
                    max={100}
                    autoComplete=""
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="X_marksheet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    X Marksheet
                  </label>
                  <input
                    disabled
                    value={values.X_marksheet}
                    onChange={handleInputChange}
                    type="text"
                    name="X_marksheet"
                    id="X_marksheet"
                    autoComplete="X_marksheet"
                    placeholder="Drive Link"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="XII_board"
                    className="block text-sm font-medium text-gray-700"
                  >
                    XII Board
                  </label>
                  <input
                    disabled
                    value={values.XII_board}
                    onChange={handleInputChange}
                    type="text"
                    name="XII_board"
                    id="XII_board"
                    autoComplete="XII_board"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="XII_YOP"
                    className="block text-sm font-medium text-gray-700"
                  >
                    XII Year Of Passing
                  </label>
                  <input
                    disabled
                    value={values.XII_YOP}
                    onChange={handleInputChange}
                    type="text"
                    name="XII_YOP"
                    id="XII_YOP"
                    autoComplete="XII_YOP"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="XII_marks"
                    className="block text-sm font-medium text-gray-700"
                  >
                    XII Marks
                  </label>
                  <input
                    disabled
                    value={values.XII_marks}
                    onChange={handleInputChange}
                    type="number"
                    name="XII_marks"
                    id="XII_marks"
                    max={100}
                    autoComplete=""
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <label
                    htmlFor="XII_marksheet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    XII Marksheet
                  </label>
                  <input
                    disabled
                    value={values.XII_marksheet}
                    onChange={handleInputChange}
                    type="text"
                    name="XII_marksheet"
                    id="XII_marksheet"
                    autoComplete="XII_marksheet"
                    placeholder="Drive Link"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="bachelor_marks"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bachelor&apos;s Marks
                  </label>
                  <input
                    disabled
                    value={values.bachelor_marks}
                    onChange={handleInputChange}
                    type="text"
                    name="bachelor_marks"
                    id="bachelor_marks"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="master_marks"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Master&apos;s Marks
                  </label>
                  <input
                    disabled
                    value={values.master_marks}
                    onChange={handleInputChange}
                    type="text"
                    name="master_marks"
                    id="master_marks"
                    autoComplete=""
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label
                    htmlFor="admission_year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Year of admission
                  </label>
                  <input
                    disabled
                    value={values.admission_year}
                    onChange={handleInputChange}
                    type="number"
                    min={2000}
                    max={2200}
                    name="admission_year"
                    id="admission_year"
                    autoComplete="admission_year"
                    placeholder="Ex: 2022"
                    required
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-red-300 rounded-md"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="all_sem_marksheet"
                    className="block text-sm font-medium text-gray-700"
                  >
                    All Sem Marksheets
                  </label>
                  <input
                    disabled
                    value={values.all_sem_marksheet}
                    onChange={handleInputChange}
                    type="text"
                    name="all_sem_marksheet"
                    id="all_sem_marksheet"
                    autoComplete="all_sem_marksheet"
                    placeholder="Drive Link"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="total_backlogs"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Backlogs
                  </label>
                  <input
                    disabled
                    value={values.total_backlogs}
                    onChange={handleInputChange}
                    type="text"
                    name="total_backlogs"
                    id="total_backlogs"
                    autoComplete="total_backlogs"
                    placeholder="Ex: 0,1"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="current_backlogs"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Backlogs
                  </label>
                  <input
                    disabled
                    value={values.current_backlogs}
                    onChange={handleInputChange}
                    type="text"
                    name="current_backlogs"
                    id="current_backlogs"
                    autoComplete="current_backlogs"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>

                <div className="col-span-3 sm:col-span-2">
                  <label
                    htmlFor="current_status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Status
                  </label>
                  <input
                    disabled
                    value={values.current_status}
                    onChange={handleInputChange}
                    type="text"
                    name=""
                    id="current_status"
                    autoComplete="current_status"
                    placeholder="Ex: P/F"
                    required
                    className="mt-0 block w-full px-0.5 border-0 border-b-2 text-sm text-gray-600 border-gray-300 focus:ring-0 focus:border-stone-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {values.is_mtech && (
          <>
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    M.tech Academic Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Student Personal Information, account will be active after
                    admin approval.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="mtech_college_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        College Name (Btech)
                      </label>
                      <input
                        value={values.mtech_college_name}
                        onChange={handleInputChange}
                        type="text"
                        name="mtech_college_name"
                        id="mtech_college_name"
                        autoComplete="email"
                        required={values.is_mtech}
                        className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="mtech_YOP"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Year of Passing
                      </label>
                      <input
                        value={values.mtech_YOP}
                        onChange={handleInputChange}
                        type="number"
                        min={2000}
                        max={2200}
                        name="mtech_YOP"
                        id="mtech_YOP"
                        autoComplete="mtech_YOP"
                        placeholder="Ex: 2022"
                        required={values.is_mtech}
                        className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="mtech_spi_1"
                        className="block text-sm font-medium text-gray-700"
                      >
                        1st Sem CGPA
                      </label>
                      <input
                        value={values.mtech_spi_1}
                        onChange={handleInputChange}
                        required={values.is_mtech}
                        type="number"
                        min={2}
                        max={10}
                        step=".01"
                        placeholder="Ex: 8.86"
                        name="mtech_spi_1"
                        id="mtech_spi_1"
                        autoComplete="mtech_spi_1"
                        className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="mtech_spi_2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        2nd Sem CGPA
                      </label>
                      <input
                        value={values.mtech_spi_2}
                        onChange={handleInputChange}
                        required={values.is_mtech}
                        type="number"
                        min={2}
                        max={10}
                        step=".01"
                        placeholder="Ex: 8.86"
                        name="mtech_spi_2"
                        id="mtech_spi_2"
                        autoComplete="mtech_spi_2"
                        className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="mtech_spi_3"
                        className="block text-sm font-medium text-gray-700"
                      >
                        3rd Sem CGPA
                      </label>
                      <input
                        value={values.mtech_spi_3}
                        required={values.is_mtech}
                        onChange={handleInputChange}
                        type="number"
                        min={2}
                        max={10}
                        step=".01"
                        placeholder="Ex: 8.86"
                        name="mtech_spi_3"
                        id="mtech_spi_3"
                        autoComplete="mtech_spi_3"
                        className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="mtech_spi_4"
                        className="block text-sm font-medium text-gray-700"
                      >
                        4th Sem CGPA
                      </label>
                      <input
                        value={values.mtech_spi_4}
                        onChange={handleInputChange}
                        required={values.is_mtech}
                        type="number"
                        min={2}
                        max={10}
                        step=".01"
                        placeholder="Ex: 8.86"
                        name="mtech_spi_4"
                        id="mtech_spi_4"
                        autoComplete="mtech_spi_4"
                        className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-stone-500"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="mtech_gate_rank"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gate Rank
                      </label>
                      <input
                        required={values.is_mtech}
                        value={values.mtech_gate_rank}
                        onChange={handleInputChange}
                        type="number"
                        name="mtech_gate_rank"
                        id="mtech_gate_rank"
                        autoComplete="mtech_gate_rank"
                        className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="mtech_gate_score"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gate Score
                      </label>
                      <input
                        required={values.is_mtech}
                        value={values.mtech_gate_score}
                        onChange={handleInputChange}
                        type="number"
                        name="mtech_gate_score"
                        id="mtech_gate_score"
                        autoComplete="mtech_gate_score"
                        className="mt-1 focus:ring-yellow-500 focus:border-yellow-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* for docs */}

        {/* Note:- Beware that the "typee" is also responsible for the toogle effect of view of "google drive link"  */}

        {/* <StudentDocs
          key={1}
          uploadedDoc={resume.data}
          google_drive_link={resume_link}
          doc_name={'Resume'}
        /> */}
        <StudentDocs
          key={2}
          uploadedDoc={tenthCertificate.data}
          google_drive_link={newStudent.X_marksheet}
          doc_name={"Tenth Certificate"}
        />

        <StudentDocs
          key={3}
          uploadedDoc={twelthCertificate.data}
          google_drive_link={newStudent.XII_marksheet}
          doc_name={"Twelth Certificate"}
        />
        <StudentDocs
          key={4}
          uploadedDoc={aadharCard.data}
          doc_name={"AadharCard"}
        />
        <StudentDocs
          key={5}
          uploadedDoc={drivingLicence.data}
          google_drive_link={newStudent.driving_licience_link}
          doc_name={"Driving Licence"}
        />
        <StudentDocs
          key={6}
          uploadedDoc={allSemMarksheet.data}
          google_drive_link={newStudent.all_sem_marksheet}
          doc_name={"All Sem Marksheet"}
        />
        <StudentDocs key={7} uploadedDoc={panCard.data} doc_name={"Pan Card"} />

        {/* Toggle effect docs */}

        {values.category !== "general" ? (
          <StudentDocs
            key={8}
            uploadedDoc={casteCertificate.data}
            google_drive_link={values.category_link}
            doc_name={"Caste Certificate"}
          />
        ) : null}

        {values.pwd && (
          <StudentDocs
            key={9}
            uploadedDoc={disabilityCertificate.data}
            google_drive_link={values.disability_certificate}
            doc_name={"Disability Certificate"}
          />
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Edit
          </button>
        </div>

        {/* <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
          <dt className='text-sm font-medium text-gray-500'>Resume</dt>
          <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
            <ul
              role='list'
              className='border border-gray-200 rounded-md divide-y divide-gray-200'
            >
              <li className='pl-3 pr-4 py-3 flex items-center justify-between text-sm'>
                <div className='w-0 flex-1 flex items-center'>
                  <PaperClipIcon
                    className='flex-shrink-0 h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  <span className='ml-2 flex-1 w-0 truncate'>
                    {resume ? 'resume.pdf' : 'No resume found'}
                  </span>
                </div>
                <div className='ml-4 flex-shrink-0 space-x-4'>
                  {resume.data ? (
                    <div className=''>
                      <a
                        href={`${API_URL}${resume.data.attributes.url}`}
                        target='_blank'
                        rel='noreferrer'
                        className='font-medium text-green-600 hover:text-green-500 px-2'
                      >
                        Download
                      </a>
                      <a
                        href={newStudent.resume_link}
                        target='_blank'
                        rel='noreferrer'
                        className='font-medium text-green-600 hover:text-green-500'
                      >
                        Google Drive Link
                      </a>
                    </div>
                  ) : (
                    <p className='font-medium text-green-600 hover:text-green-500'>
                      NA
                    </p>
                  )}
                </div>
              </li>
            </ul>
          </dd>
        </div> */}
      </div>
    </form>
    <div>
    {lastUpdatedBy?(
    <>
            <div> <h1 className="text-red-700">Last Updated by</h1> </div>
            <div className="text-red-900"> 
              <p>Role : {lastUpdatedBy.role}</p>
              <p>User Name : {lastUpdatedBy.username}</p>
              <p>Email : {lastUpdatedBy.email}</p>
              <p>At : {lastUpdatedBy.timeStamp}</p>
            </div>
    </>
    ):null}
    </div>
    </>
  );
}
