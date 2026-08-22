// import { useRequest } from "../../../context/RequestContext";

// export default function BodyEditor() {
//   const { selectedRequest, updateRequest } = useRequest();

//   if (!selectedRequest) return null;

//   const handleChange = (e) => {
//     updateRequest(selectedRequest._id, {
//       body: e.target.value,
//     });
//   };

//   return (
//     <div className="p-4">
//       <textarea
//         value={selectedRequest.body || ""}
//         onChange={handleChange}
//         placeholder="Request Body"
//         className="w-full h-80 border rounded p-3 font-mono outline-none"
//       />
//     </div>
//   );
// }