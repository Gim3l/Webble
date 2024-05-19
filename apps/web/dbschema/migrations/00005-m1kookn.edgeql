CREATE MIGRATION m1kooknfpc3py3prnbpeokjroqbmqdqoannrddbomrvfkl5555dzzq
    ONTO m17zx5pcl2hpmpebvt5oqdisre3zc7sec2j6nyrqsetavfngkltwta
{
  ALTER TYPE default::FormVariable {
      CREATE CONSTRAINT std::exclusive ON ((.form, .label));
  };
};
