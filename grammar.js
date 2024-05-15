module.exports = grammar({
  name: 'ebnf',
  extras: $ => [/\s/, $.comments],
  conflicts: $ => [
    [ $.char_match, $.range ],
    [ $.body, $._expression_opt_nl],
  ],
  rules: {
    grammar: $ => seq(repeat(seq($._line, repeat1('\n'))), optional($._line)),
    _line: $=> choice($.pragma, $.rule),
    pragma: $ => /@\w+/, // Not defined in XML spec, but used in RDF-related specs
    rule: $ => seq(optional($.label), $.name, '::=', $.body),
    label: $ => /\[[0-9A-Za-z]+\]/,
    body: $ => $.expression,
    name: $ => $.symbol,
    symbol: $ => choice($._start_symbol, $._symbol),
    _start_symbol: $ => /\p{Uppercase}(\w|_)*/,
    _symbol: $ => /\p{Lowercase}(\w|_)*/,
    expression: $ => choice(
      $.rule_ref,
      $.hex_char,
      $.char_match,
      $.string_literal,
      $.unit,
      $.optional,
      $.sequence,
      $.alternation,
      $.difference,
      $.one_or_more,
      $.zero_or_more
    ),
    rule_ref: $ => $.symbol,
    hex_char: $ => $.hex_integer, hex_integer: $ => /#x[0-9a-fA-F]+/,
    char_match: $ => seq('[', optional($.neg_marker), repeat(choice($._char_atom, $.range)), ']'),
    neg_marker: $ => '^',
    match_character: $ => /[^\]-]/,
    range: $ => seq($._char_atom, '-', $._char_atom),
    _char_atom: $ => choice(
      // Magic from https://github.com/tree-sitter/tree-sitter-regex/blob/master/grammar.js#L120-L121
      $.hex_integer, choice(alias('-', $.match_character), $.match_character)
    ),
    unit: $ => prec(3, seq('(', $.expression, ')')),
    string_literal: $ => choice($.double_quoted_string, $.single_quoted_string),
    single_quoted_string: $ => /'[^']*'/,
    double_quoted_string: $ => token(choice(/"([^"]|(\\\\"))*"/, /"\\""/)),
    optional: $ => prec(3, seq($.expression, '?')),
    sequence: $ => prec.left(2, seq($.expression, $.expression)),
    _expression_opt_nl: $ => seq($.expression, optional('\n')),
    alternation: $ => prec.left(1, seq($._expression_opt_nl, '|', $.expression)),
    difference: $ => prec(2, prec.left(seq($.expression, '-', $.expression))),
    one_or_more: $ => prec(3, seq($.expression, '+')),
    zero_or_more: $ => prec(3, seq($.expression, '*')),
    comments: $ => seq('/*', repeat(/./), '*/'),
    wfc: $ => seq('[ wfc:', $.constraint_name, ']'),
    vc: $ => seq('[ vc:', $.constraint_name, ']'),
    constraint_name: $ => /[^\]]/
  }
});
