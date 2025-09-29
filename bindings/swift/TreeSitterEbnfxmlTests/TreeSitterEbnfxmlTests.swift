import XCTest
import SwiftTreeSitter
import TreeSitterEbnfxml

final class TreeSitterEbnfxmlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_ebnfxml())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading EBNF XML grammar")
    }
}
