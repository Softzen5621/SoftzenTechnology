import { useEffect, useState } from "react";

import api from "../../services/api";

import {
  Bell,
  Upload,
  Trash2,
  Eye,
  CheckCircle,
  Pin,
  Pencil,
  X,
  Clock3,
  Users,
  UserCheck,
  School,
  GraduationCap,
  User,
} from "lucide-react";

const Notices = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      audience: "all",

      type: "mandatory",

      priority: "normal",

      popup: false,

      expiryDate: "",
    });

  const [attachment, setAttachment] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [notices, setNotices] =
    useState([]);

  const [editId, setEditId] =
    useState(null);

  // =====================================================
  // FETCH NOTICES
  // =====================================================

  const fetchNotices = async () => {

    try {

      const res =
        await api.get("/notices");

      const data =
        res.data.notices || [];

      setNotices(data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchNotices();

  }, []);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({

      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {

    setFormData({

      title: "",

      description: "",

      audience: "all",

      type: "mandatory",

      priority: "normal",

      popup: false,

      expiryDate: "",
    });

    setAttachment(null);

    setEditId(null);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (notice) => {

    setEditId(notice._id);

    setFormData({

      title:
        notice.title || "",

      description:
        notice.description || "",

      audience:
        notice.audience?.[0] || "all",

      type:
        notice.type || "mandatory",

      priority:
        notice.priority || "normal",

      popup:
        notice.popup || false,

      expiryDate:
        notice.expiryDate
          ? notice.expiryDate.split("T")[0]
          : "",
    });

    window.scrollTo({

      top: 0,

      behavior: "smooth",
    });
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const data =
        new FormData();

      Object.keys(formData).forEach(
        (key) => {

          data.append(
            key,
            formData[key]
          );
        }
      );

      if (attachment) {

        data.append(
          "attachment",
          attachment
        );
      }

      if (editId) {

        await api.put(

          `/notices/${editId}`,

          data
        );

        alert(
          "Notice updated successfully"
        );
      }

      else {

        await api.post(

          "/notices/create",

          data
        );

        alert(
          "Notice created successfully"
        );
      }

      resetForm();

      fetchNotices();

    } catch (error) {

      console.log(error);

      alert(
        "Failed to save notice"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this notice?"
      );

    if (!confirmDelete)
      return;

    try {

      await api.delete(
        `/notices/${id}`
      );

      fetchNotices();

    } catch (error) {

      console.log(error);

      alert(
        "Failed to delete notice"
      );
    }
  };

  // =====================================================
  // TIMER
  // =====================================================

  const getCountdown = (
    expiryDate
  ) => {

    if (!expiryDate)
      return null;

    const expiry =
      new Date(expiryDate);

    const now =
      new Date();

    const diff =
      expiry - now;

    if (diff <= 0)
      return "Expired";

    const days =
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );

    const hours =
      Math.floor(
        (
          diff %
          (1000 *
            60 *
            60 *
            24)
        ) /
          (1000 * 60 * 60)
      );

    return `${days}d ${hours}h left`;
  };

  // =====================================================
  // AUDIENCE LABEL
  // =====================================================

  const renderAudience =
    (audience) => {

      if (
        audience?.includes(
          "all"
        )
      ) {

        return {

          label:
            "Whole School",

          icon:
            <School className="w-4 h-4" />,
        };
      }

      if (
        audience?.includes(
          "teacher"
        )
      ) {

        return {

          label:
            "Teachers",

          icon:
            <UserCheck className="w-4 h-4" />,
        };
      }

      if (
        audience?.includes(
          "parent"
        )
      ) {

        return {

          label:
            "Parents",

          icon:
            <Users className="w-4 h-4" />,
        };
      }

      return {

        label:
          "Students",

        icon:
          <GraduationCap className="w-4 h-4" />,
      };
    };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="p-6 space-y-8 bg-slate-100 min-h-screen">

      {/* HEADER */}

      <div className="flex items-center gap-4">

        <div className="bg-blue-600 p-3 rounded-2xl text-white">

          <Bell className="w-7 h-7" />

        </div>

        <div>

          <h1 className="text-3xl font-black text-gray-800">
            Notice Management
          </h1>

          <p className="text-gray-500 mt-1">
            Enterprise School Notice System
          </p>

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <p className="text-gray-500">
            Total Notices
          </p>

          <h1 className="text-4xl font-black mt-2">
            {notices.length}
          </h1>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <p className="text-gray-500">
            Popup Notices
          </p>

          <h1 className="text-4xl font-black text-blue-600 mt-2">

            {
              notices.filter(
                (n) => n.popup
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <p className="text-gray-500">
            Force Notices
          </p>

          <h1 className="text-4xl font-black text-red-600 mt-2">

            {
              notices.filter(
                (n) =>
                  n.type ===
                  "locked"
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <p className="text-gray-500">
            Acknowledgement Notices
          </p>

          <h1 className="text-4xl font-black text-orange-500 mt-2">

            {
              notices.filter(
                (n) =>
                  n.type ===
                  "mandatory"
              ).length
            }

          </h1>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-sm p-8 space-y-5"
      >

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">

            {
              editId
                ? "Update Notice"
                : "Create Notice"
            }

          </h2>

          {

            editId && (

              <button
                type="button"
                onClick={resetForm}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-2xl flex items-center gap-2"
              >

                <X className="w-4 h-4" />

                Cancel

              </button>
            )
          }

        </div>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Notice title"
          required
          className="w-full border rounded-2xl px-5 py-4"
        />

        <textarea
          rows="5"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Notice description..."
          required
          className="w-full border rounded-2xl px-5 py-4"
        />

        <div className="grid md:grid-cols-2 gap-5">

          <select
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            className="border rounded-2xl px-5 py-4"
          >

            <option value="all">
              Whole School
            </option>

            <option value="teacher">
              Teachers
            </option>

            <option value="parent">
              Parents
            </option>

            <option value="student">
              Students
            </option>

          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded-2xl px-5 py-4"
          >

            <option value="mandatory">
              Acknowledgement Required
            </option>

            <option value="locked">
              Force Notice
            </option>

          </select>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border rounded-2xl px-5 py-4"
          >

            <option value="normal">
              Normal
            </option>

            <option value="important">
              Important
            </option>

            <option value="urgent">
              Urgent
            </option>

          </select>

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="border rounded-2xl px-5 py-4"
          />

        </div>

        {/* FILE */}

        <label className="flex items-center gap-3 border rounded-2xl px-5 py-4 cursor-pointer">

          <Upload className="w-5 h-5 text-gray-600" />

          <span className="text-gray-600">

            {
              attachment
                ? attachment.name
                : "Upload PDF or Image"
            }

          </span>

          <input
            type="file"
            hidden
            onChange={(e) =>
              setAttachment(
                e.target.files[0]
              )
            }
          />

        </label>

        {/* POPUP */}

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="popup"
            checked={formData.popup}
            onChange={handleChange}
          />

          <label>
            Show as Popup Notice
          </label>

        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold"
        >

          {
            loading
              ? "Saving..."
              : editId
              ? "Update Notice"
              : "Create Notice"
          }

        </button>

      </form>

      {/* NOTICE LIST */}

      <div className="space-y-5">

        <h2 className="text-2xl font-black text-gray-800">
          All Notices
        </h2>

        {

          notices.map((notice) => {

            const audience =
              renderAudience(
                notice.audience
              );

            return (

              <div
                key={notice._id}
                className={`bg-white rounded-3xl shadow-sm p-7 border-l-4 ${
                  notice.type ===
                  "locked"
                    ? "border-red-500"
                    : "border-orange-500"
                }`}
              >

                <div className="flex items-start justify-between gap-6">

                  <div className="flex-1">

                    {/* TITLE */}

                    <div className="flex flex-wrap items-center gap-3 mb-3">

                      <h2 className="text-2xl font-bold text-gray-800">

                        {notice.title}

                      </h2>

                      {

                        notice.type ===
                          "locked" && (

                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">

                            <Pin className="w-3 h-3" />

                            Force Notice

                          </span>
                        )
                      }

                      {

                        notice.type ===
                          "mandatory" && (

                          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">

                            Acknowledgement Required

                          </span>
                        )
                      }

                      {

                        notice.popup && (

                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">

                            Popup

                          </span>
                        )
                      }

                    </div>

                    {/* DESCRIPTION */}

                    <p className="text-gray-600 leading-relaxed">

                      {notice.description}

                    </p>

                    {/* TIMER */}

                    {

                      notice.type ===
                        "locked" &&

                        notice.expiryDate && (

                          <div className="flex items-center gap-2 mt-4 text-red-600 font-semibold text-sm">

                            <Clock3 className="w-4 h-4" />

                            {
                              getCountdown(
                                notice.expiryDate
                              )
                            }

                          </div>
                        )
                    }

                    {/* ANALYTICS */}

                    <div className="flex flex-wrap items-center gap-5 mt-6">

                      {/* AUDIENCE */}

                      <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-sm font-medium">

                        {audience.icon}

                        {audience.label}

                      </div>

                      {/* VIEWS */}

                      <div className="flex items-center gap-2 text-gray-600">

                        <Eye className="w-4 h-4" />

                        <span>

                          {
                            notice.viewedBy
                              ?.length || 0
                          }

                          {" "}
                          Views

                        </span>

                      </div>

                      {/* ACKNOWLEDGED */}

                      <div className="flex items-center gap-2 text-green-600">

                        <CheckCircle className="w-4 h-4" />

                        <span>

                          {
                            notice
                              .acknowledgedBy
                              ?.length || 0
                          }

                          {" "}
                          Acknowledged

                        </span>

                      </div>

                    </div>

                    {/* USER LIST */}

                    <div className="mt-6 grid md:grid-cols-2 gap-4">

                      {/* VIEWED USERS */}

                      <div className="bg-slate-50 rounded-2xl p-4">

                        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">

                          <Eye className="w-4 h-4" />

                          Viewed By

                        </h3>

                        {

                          notice.viewedBy
                            ?.length > 0 ? (

                            <div className="space-y-2">

                              {

                                notice.viewedBy.map(
                                  (
                                    item,
                                    index
                                  ) => (

                                    <div
                                      key={
                                        index
                                      }
                                      className="flex items-center gap-2 text-sm text-gray-600"
                                    >

                                      <User className="w-4 h-4" />

                                      {
                                        item.role
                                      }

                                    </div>
                                  )
                                )
                              }

                            </div>

                          ) : (

                            <p className="text-sm text-gray-400">
                              No views yet
                            </p>
                          )
                        }

                      </div>

                      {/* ACKNOWLEDGED USERS */}

                      <div className="bg-green-50 rounded-2xl p-4">

                        <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">

                          <CheckCircle className="w-4 h-4" />

                          Acknowledged By

                        </h3>

                        {

                          notice
                            .acknowledgedBy
                            ?.length > 0 ? (

                            <div className="space-y-2">

                              {

                                notice
                                  .acknowledgedBy.map(
                                    (
                                      item,
                                      index
                                    ) => (

                                      <div
                                        key={
                                          index
                                        }
                                        className="flex items-center gap-2 text-sm text-green-700"
                                      >

                                        <User className="w-4 h-4" />

                                        {
                                          item.role
                                        }

                                      </div>
                                    )
                                  )
                              }

                            </div>

                          ) : (

                            <p className="text-sm text-gray-400">
                              No acknowledgements
                            </p>
                          )
                        }

                      </div>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-col gap-3">

                    <button
                      onClick={() =>
                        handleEdit(notice)
                      }
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-2xl"
                    >

                      <Pencil className="w-5 h-5" />

                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          notice._id
                        )
                      }
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-2xl"
                    >

                      <Trash2 className="w-5 h-5" />

                    </button>

                  </div>

                </div>

              </div>
            );
          })
        }

      </div>

    </div>
  );
};

export default Notices;