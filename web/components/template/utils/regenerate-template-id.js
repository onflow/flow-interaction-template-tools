import * as fcl from "@onflow/fcl";

export const regenerateTemplateID = async (template) => {
  // template.f_type = "InteractionTemplate";
  // delete template?.f_vsn;
  // template.f_version = "1.0.0";

  // console.log("template", template);

  template = {
    f_type: "InteractionTemplate",
    f_version: "1.0.0",
    id: template.id,
    data: template.data,
  };

  let regeneratedId = await fcl.InteractionTemplateUtils.generateTemplateId({
    template,
  });
  template.id = regeneratedId;

  // console.log("template", template);

  return template;
};
