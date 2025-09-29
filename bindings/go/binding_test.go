package tree_sitter_ebnfxml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ebnfxml "github.com/eyusupov/tree-sitter-ebnf-xml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ebnfxml.Language())
	if language == nil {
		t.Errorf("Error loading EBNF XML grammar")
	}
}
