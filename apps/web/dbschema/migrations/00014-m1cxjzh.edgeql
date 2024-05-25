CREATE MIGRATION m1cxjzhpcvoue56l4ileadff5iw4ctl55sqy3aem2exlf6cgm4ygyq
    ONTO m1ph2dzxa47csu77aafi64odvqonarnhf74khiei7devbmrletbolq
{
  ALTER TYPE default::ChatSession {
      ALTER PROPERTY last_group {
          RENAME TO values;
      };
  };
  ALTER TYPE default::ChatSession {
      DROP PROPERTY snapshot;
  };
};
