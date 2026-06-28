/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createClient } from "../api/clients";

type Props = {
  onSuccess: (client: any) => void;
};

const CreateClientForm = ({
  onSuccess,
}: Props) => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      preferredMode: "CALL",
      reminderBefore: 30,
    });

  const [errors, setErrors] =
    useState<any>({});

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = [
        "Name is required",
      ];
    }

    if (!formData.email.trim()) {
      newErrors.email = [
        "Email is required",
      ];
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email = [
        "Invalid email",
      ];
    }

    if (!formData.phone.trim()) {
      newErrors.phone = [
        "Phone is required",
      ];
    } else if (
      !/^\d{10}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = [
        "Phone must be exactly 10 digits",
      ];
    }

    if (
      !formData.address.trim()
    ) {
      newErrors.address = [
        "Address is required",
      ];
    }

    if (
      Number(
        formData.reminderBefore
      ) < 0
    ) {
      newErrors.reminderBefore =
        [
          "Reminder must be valid",
        ];
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (!validateForm())
        return;

      setLoading(true);

      const start =
        Date.now();

      try {
        const client =
          await createClient(
            formData
          );

        // minimum loader time
        const elapsed =
          Date.now() -
          start;

        if (elapsed < 1000) {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                1000 -
                  elapsed
              )
          );
        }

        onSuccess(client);

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          preferredMode:
            "CALL",
          reminderBefore: 30,
        });

        setErrors({});
      } catch (err: any) {
        const apiErrors =
          err.response?.data
            ?.errors
            ?.fieldErrors ||
          {};

        setErrors(apiErrors);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="bg-white rounded-2xl border p-6 mb-8">
      <h3 className="text-2xl font-semibold mb-6">
        Add New Client
      </h3>

      <form
        onSubmit={
          handleSubmit
        }
        className="grid gap-5"
      >
        {/* row 1 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={
                formData.name
              }
              onChange={(
                e
              ) =>
                handleChange(
                  "name",
                  e.target
                    .value
                )
              }
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .name[0]
                }
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={
                formData.email
              }
              onChange={(
                e
              ) =>
                handleChange(
                  "email",
                  e.target
                    .value
                )
              }
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .email[0]
                }
              </p>
            )}
          </div>
        </div>

        {/* row 2 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Phone"
              value={
                formData.phone
              }
              onChange={(
                e
              ) =>
                handleChange(
                  "phone",
                  e.target
                    .value
                )
              }
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .phone[0]
                }
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Address"
              value={
                formData.address
              }
              onChange={(
                e
              ) =>
                handleChange(
                  "address",
                  e.target
                    .value
                )
              }
              className="border rounded-xl px-4 py-3 w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .address[0]
                }
              </p>
            )}
          </div>
        </div>

        {/* row 3 */}
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={
              formData.preferredMode
            }
            onChange={(
              e
            ) =>
              handleChange(
                "preferredMode",
                e.target
                  .value
              )
            }
            className="border rounded-xl px-4 py-3 w-full"
          >
            <option value="CALL">
              CALL
            </option>
            <option value="EMAIL">
              EMAIL
            </option>
            <option value="WHATSAPP">
              WHATSAPP
            </option>
          </select>

          <div>
            <input
              type="number"
              placeholder="Reminder Before"
              value={
                formData.reminderBefore
              }
              onChange={(
                e
              ) =>
                handleChange(
                  "reminderBefore",
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="border rounded-xl px-4 py-3 w-full"
            />

            {errors.reminderBefore && (
              <p className="text-red-500 text-sm mt-1">
                {
                  errors
                    .reminderBefore[0]
                }
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </>
          ) : (
            "Add Client"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateClientForm;