import {
  CheckCircle2,
  Copy,
  ShieldCheck,
  User,
  KeyRound,
  School,
} from "lucide-react";


const TeacherCredentialsModal = ({
  credentials,
  setCredentials,
}) => {

  // =====================================
  // COPY TEXT
  // =====================================

  const copyToClipboard =
    async (text) => {

      try {

        await navigator.clipboard.writeText(
          text
        );

        alert("Copied");

      } catch (error) {

        console.log(error);
      }
    };


  return (

    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">

      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">


        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">

              <CheckCircle2 size={34} />

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Teacher Created Successfully
              </h2>

              <p className="text-blue-100 mt-1">
                Save login credentials securely
              </p>

            </div>

          </div>

        </div>


        {/* ===================================== */}
        {/* BODY */}
        {/* ===================================== */}

        <div className="p-8 space-y-6">


          {/* ===================================== */}
          {/* TEACHER ID */}
          {/* ===================================== */}

          <div className="border rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">

                  <School size={22} />

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Teacher ID
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mt-1">

                    {
                      credentials.teacherId
                    }

                  </h3>

                </div>

              </div>


              <button
                onClick={() =>
                  copyToClipboard(
                    credentials.teacherId
                  )
                }
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >

                <Copy size={18} />

              </button>

            </div>

          </div>


          {/* ===================================== */}
          {/* PASSWORD */}
          {/* ===================================== */}

          <div className="border rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">

                  <KeyRound size={22} />

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Temporary Password
                  </p>

                  <h3 className="text-xl font-bold text-gray-800 mt-1">

                    {
                      credentials.password
                    }

                  </h3>

                </div>

              </div>


              <button
                onClick={() =>
                  copyToClipboard(
                    credentials.password
                  )
                }
                className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >

                <Copy size={18} />

              </button>

            </div>

          </div>


          {/* ===================================== */}
          {/* LOGIN INFO */}
          {/* ===================================== */}

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">

            <div className="flex gap-4">

              <div className="text-blue-600 mt-1">

                <User size={24} />

              </div>

              <div>

                <h4 className="font-semibold text-blue-800">
                  Teacher Login Access
                </h4>

                <p className="text-sm text-blue-700 mt-2 leading-relaxed">

                  Teacher can login using
                  Teacher ID and temporary
                  password provided above.

                </p>

              </div>

            </div>

          </div>


          {/* ===================================== */}
          {/* SECURITY NOTICE */}
          {/* ===================================== */}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">

            <div className="flex gap-4">

              <div className="text-amber-600 mt-1">

                <ShieldCheck size={24} />

              </div>

              <div>

                <h4 className="font-semibold text-amber-800">
                  Security Notice
                </h4>

                <p className="text-sm text-amber-700 mt-2 leading-relaxed">

                  Teacher will be forced to
                  reset password during
                  first login for account
                  security.

                </p>

              </div>

            </div>

          </div>


          {/* ===================================== */}
          {/* ACTIONS */}
          {/* ===================================== */}

          <div className="flex gap-4 pt-2">


            {/* COPY ALL */}

            <button
              onClick={() => {

                copyToClipboard(

`Teacher ID: ${credentials.teacherId}

Password: ${credentials.password}`

                );
              }}
              className="flex-1 border border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-medium transition"
            >

              Copy All

            </button>


            {/* DONE */}

            <button
              onClick={() =>
                setCredentials(null)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
            >

              Done

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default TeacherCredentialsModal;