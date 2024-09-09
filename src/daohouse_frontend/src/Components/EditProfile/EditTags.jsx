import React, { useState, useEffect } from "react";
import Xtag from "../../../assets/Xtag.png";

const EditTags = ({ editTags, handleTagsChange }) => {
  const defaultTags = ["Marketer", "Developer", "Entrepreneur", "Investor"];
  const [tags, setTags] = useState(editTags || []);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setTags(editTags);
  }, [editTags]);

  const toggleTagSelection = (tag) => {
    const updatedTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setTags(updatedTags);
    handleTagsChange(updatedTags);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() !== "" && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      handleTagsChange(updatedTags);
      setNewTag("");
    }
  };

  return (
    <div className="bg-[#FFFFFF] md:text-[16px] text-[12px] font-normal text-[#646464] md:py-3 md:px-5 p-3 my-2 rounded-lg">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {defaultTags.map((tag) => (
          <button
            key={tag}
            className={`py-2 px-4 rounded-full transition-colors shadow-md ${
              tags.includes(tag)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`
            
          }
            onClick={() => toggleTagSelection(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="md:mr-3 mr-2 my-2 py-2 md:pl-12 pl-6 rounded-full bg-[#DFE9EE] font-normal text-[#05212C] flex items-center justify-between"
            style={{
              boxShadow:
                "0px 0.46px 2.56px 0px #00000003, 0px 2.04px 5.3px 0px #00000005, 0px 5px 10.56px 0px #00000006, 0px 9.63px 20.7px 0px #00000008, 0px 16.2px 38.07px 0px #0000000A, 0px 25px 65px 0px #0000000D",
            }}
          >
            {tag}
            <img
              src={Xtag}
              alt="cross-icon"
              className="md:ml-8 ml-3 md:mr-4 mr-3 cursor-pointer"
              onClick={() => toggleTagSelection(tag)}
            />
          </span>
        ))}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add your own tag"
            className="border border-[#DFE9EE] py-2 px-4 rounded-md mr-2"
          />
          <button
            type="submit"
            className="text-[#05212C] font-semibold ml-2 cursor-pointer"
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTags;
