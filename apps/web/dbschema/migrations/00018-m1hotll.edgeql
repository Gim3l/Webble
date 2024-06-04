CREATE MIGRATION m1hotll32744tsbad6mdygkxthsvjnanw2gakckfqvp6lhe5gipzfa
    ONTO m1brkmh53wyhndyok2gwnqybe55zqwrboqxn3iq2qgiqruftgekita
{
  ALTER TYPE default::Image {
      ALTER LINK project {
          RENAME TO form;
      };
  };
};
