// "use client";
// import React, { useEffect, useState } from "react";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "../../Label";
// import Input from "../../input/InputField";
// import Select from "../../Select";

// type FormDataType = {
//   user_id: string;
//   type: string;
//   amount: number | "";
//   animal_name?: string;
//   animal_id?: string;
//   transaction_date: string;
// };

// export default function HewanInput() {
//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState<FormDataType>({
//     user_id: "",
//     type: "",
//     amount: "",
//     transaction_date: today,
//   });

//   const [animals, setAnimals] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);

//   useEffect(() => {
//     fetch("/api/users")
//       .then((res) => res.json())
//       .then(setUsers);

//     fetch("/api/animals")
//       .then((res) => res.json())
//       .then((data) =>
//         setAnimals(data.filter((a: any) => a.status === "ready"))
//       );
//   }, []);

//   const handleChange = (key: keyof FormDataType, value: any) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.user_id || !formData.type) {
//       alert("User & Type wajib diisi");
//       return;
//     }

//     console.log("SEND:", formData);

//     await fetch("/api/transactions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     alert("Transaction Created!");

//     setFormData({
//       user_id: "",
//       type: "",
//       amount: "",
//       transaction_date: today,
//     });
//   };

//   return (
//     <ComponentCard title="Add Transaction">
//       <div className="space-y-6">

//         {/* USER */}
//         <div>
//           <Label>User</Label>
//           <Select
//             options={users.map((u) => ({
//               value: u.id,
//               label: u.name,
//             }))}
//             placeholder="Select User"
//             onChange={(value: string) =>
//               handleChange("user_id", value)
//             }
//           />
//         </div>

//         {/* TYPE */}
//         <div>
//           <Label>Transaction Type</Label>
//           <Select
//             options={[
//               { value: "deposit", label: "Deposit" },
//               { value: "tarik_tunai", label: "Tarik Tunai" },
//               { value: "beli_hewan", label: "Beli Hewan" },
//               { value: "jual_hewan", label: "Jual Hewan" },
//             ]}
//             placeholder="Select Type"
//             onChange={(value: string) =>
//               handleChange("type", value)
//             }
//           />
//         </div>

//         {/* AMOUNT */}
//         {(formData.type === "deposit" ||
//           formData.type === "tarik_tunai") && (
//           <div>
//             <Label>Amount</Label>
//             <Input
//               type="number"
//               value={formData.amount}
//               onChange={(e) =>
//                 handleChange(
//                   "amount",
//                   e.target.value === "" ? "" : Number(e.target.value)
//                 )
//               }
//             />
//           </div>
//         )}

//         {/* BELI HEWAN */}
//         {formData.type === "beli_hewan" && (
//           <div className="space-y-4">
//             <div>
//               <Label>Nama Hewan</Label>
//               <Input
//                 type="text"
//                 onChange={(e) =>
//                   handleChange("animal_name", e.target.value)
//                 }
//               />
//             </div>

//             <div>
//               <Label>Harga Beli</Label>
//               <Input
//                 type="number"
//                 onChange={(e) =>
//                   handleChange(
//                     "amount",
//                     e.target.value === "" ? "" : Number(e.target.value)
//                   )
//                 }
//               />
//             </div>
//           </div>
//         )}

//         {/* JUAL HEWAN */}
//         {formData.type === "jual_hewan" && (
//           <div className="space-y-4">

//             <div>
//               <Label>Pilih Hewan</Label>
//               <Select
//                 options={animals.map((a) => ({
//                   value: a.id,
//                   label: `${a.name} - Rp ${a.buy_price}`,
//                 }))}
//                 placeholder="Select Animal"
//                 onChange={(value: string) =>
//                   handleChange("animal_id", value)
//                 }
//               />
//             </div>

//             <div>
//               <Label>Harga Jual</Label>
//               <Input
//                 type="number"
//                 placeholder="Masukkan harga jual"
//                 onChange={(e) =>
//                   handleChange(
//                     "amount",
//                     e.target.value === "" ? "" : Number(e.target.value)
//                   )
//                 }
//               />
//             </div>

//           </div>
//         )}

//         {/* TRANSACTION DATE */}
//         <div>
//           <Label>Tanggal Transaksi</Label>
//           <Input
//             type="date"
//             value={formData.transaction_date}
//             onChange={(e) =>
//               handleChange("transaction_date", e.target.value)
//             }
//           />
//         </div>

//         {/* SUBMIT */}
//         <button
//           onClick={handleSubmit}
//           className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
//         >
//           Create Transaction
//         </button>

//       </div>
//     </ComponentCard>
//   );
// }