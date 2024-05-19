CREATE MIGRATION m12vuk3gmeokm6fqauodbz7zurdac6shvp2yewerffptwfnu6fucfq
    ONTO m1kooknfpc3py3prnbpeokjroqbmqdqoannrddbomrvfkl5555dzzq
{
  ALTER TYPE default::FormVariable {
      ALTER PROPERTY label {
          CREATE CONSTRAINT std::min_len_value(2);
      };
  };
};
