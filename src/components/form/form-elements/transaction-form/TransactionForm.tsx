"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import Select from "../../Select";

type FormDataType = {
  user_id: string;
  type: string;
  amount: number | "";
  animal_name?: string;
  animal_id?: string;
  animal_request?: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  transaction_date: string;
  payment_status: string;
};

export default function TransactionInput() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<FormDataType>({
    user_id: "",
    type: "",
    amount: "",
    transaction_date: today,
    payment_status: ""
  });

  const [animals, setAnimals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users").then(res => res.json()).then(setUsers);

    fetch("/api/animals")
      .then(res => res.json())
      .then(data => setAnimals(data.filter((a: any) => a.status === "ready")));

    fetch("/api/customers")
      .then(res => res.json())
      .then(setCustomers);
  }, []);

  const animalsByOwner = animals.filter(
    (a: any) =>
      a.owner_id == formData.user_id && a.status === "ready"
  );

  const handleChange = (key: keyof FormDataType, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.user_id || !formData.type) {
      alert("User & Type wajib diisi");
      return;
    }

    // 🔥 VALIDASI JUAL HEWAN
    if (formData.type === "jual_hewan") {
      if (!formData.customer_id && !formData.customer_name) {
        alert("Customer wajib diisi");
        return;
      }

      if (!formData.animal_id && !formData.animal_request) {
        alert("Isi animal atau kebutuhan hewan");
        return;
      }
    }

    await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    alert("Transaction Created!");

    // reset
    setFormData({
      user_id: "",
      type: "",
      amount: "",
      transaction_date: today,
      payment_status: ""
    });

    // 🔥 AUTO REFRESH
    window.location.reload();
  };

  return (
    <ComponentCard title="Add Transaction">
      <div className="space-y-6">

        {/* USER */}
        <div>
          <Label>User</Label>
          <Select
            options={users.map((u) => ({
              value: u.id,
              label: u.name,
            }))}
            placeholder="Select User"
            onChange={(value: string) =>
              handleChange("user_id", value)
            }
          />
        </div>

        {/* TYPE */}
        <div>
          <Label>Transaction Type</Label>
          <Select
            options={[
              { value: "deposit", label: "Deposit" },
              { value: "tarik_tunai", label: "Tarik Tunai" },
              { value: "beli_hewan", label: "Beli Hewan" },
              { value: "jual_hewan", label: "Jual Hewan" },
            ]}
            placeholder="Select Type"
            onChange={(value: string) =>
              handleChange("type", value)
            }
          />
        </div>

        {/* AMOUNT */}
        {(formData.type === "deposit" ||
          formData.type === "tarik_tunai") && (
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  handleChange(
                    "amount",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          )}

        {/* BELI HEWAN */}
        {formData.type === "beli_hewan" && (
          <div className="space-y-4">
            <div>
              <Label>Nama Hewan</Label>
              <Input
                type="text"
                onChange={(e) =>
                  handleChange("animal_name", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Harga Beli</Label>
              <Input
                type="number"
                onChange={(e) =>
                  handleChange(
                    "amount",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        )}

        {/* JUAL HEWAN */}
        {formData.type === "jual_hewan" && (
          <div className="space-y-4">

            {/* PILIH HEWAN */}
            <div>
              <Label>Pilih Hewan (optional)</Label>
              <Select
                options={animalsByOwner.map((a) => ({
                  value: a.id,
                  label: `${a.name} - Rp ${a.buy_price}`,
                }))}
                placeholder="Kalau ada stok"
                onChange={(value: string) =>
                  handleChange("animal_id", value)
                }
              />
            </div>

            {/* REQUEST HEWAN */}
            {!formData.animal_id && (
              <div>
                <Label>Kebutuhan Hewan</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Cornsnake Amelanistic"
                  onChange={(e) =>
                    handleChange("animal_request", e.target.value)
                  }
                />
              </div>
            )}

            {/* HARGA */}
            <div>
              <Label>Harga Jual</Label>
              <Input
                type="number"
                onChange={(e) =>
                  handleChange(
                    "amount",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
            </div>

            {/* CUSTOMER SELECT */}
            <div>
              <Label>Pilih Customer</Label>
              <Select
                options={customers.map((c) => ({
                  value: c.id,
                  label: `${c.name} - ${c.phone}`,
                }))}
                placeholder="Pilih customer"
                onChange={(value: string) =>
                  handleChange("customer_id", value)
                }
              />
            </div>

            {/* INPUT CUSTOMER BARU */}
            {!formData.customer_id && (
              <>
                <div>
                  <Label>Nama Customer Baru</Label>
                  <Input
                    type="text"
                    placeholder="Nama"
                    onChange={(e) =>
                      handleChange("customer_name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>No HP</Label>
                  <Input
                    type="text"
                    placeholder="08xxxx"
                    onChange={(e) =>
                      handleChange("customer_phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Status Pembayaran</Label>
                  <Select
                    options={[
                      { value: "dp", label: "DP" },
                      { value: "paid", label: "Lunas" },
                      { value: "cancelled", label: "Cancel" },
                    ]}
                    placeholder="Pilih status pembayaran"
                    onChange={(value: string) =>
                      handleChange("payment_status", value)
                    }
                  />
                </div>
              </>
            )}

          </div>
        )}

        {/* DATE */}
        <div>
          <Label>Tanggal Transaksi</Label>
          <Input
            type="date"
            value={formData.transaction_date}
            onChange={(e) =>
              handleChange("transaction_date", e.target.value)
            }
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Create Transaction
        </button>

      </div>
    </ComponentCard>
  );
}