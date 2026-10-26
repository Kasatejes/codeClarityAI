import type { SampleSnippet } from '../types';

export const SAMPLE_SNIPPETS: SampleSnippet[] = [
  {
    id: 'py-index-error',
    title: 'Python: List Index Out of Range',
    language: 'python',
    category: 'IndexError / Off-by-One',
    code: `# Calculate running sum of scores
scores = [85, 92, 78, 90, 88]
total = 0

# Bug: Loop runs up to len(scores) + 1
for i in range(len(scores) + 1):
    total += scores[i]

print("Average score:", total / len(scores))
`,
    errorMessage: `IndexError: list index out of range on line 7:
    total += scores[i]`,
  },
  {
    id: 'py-type-error',
    title: 'Python: Type Mismatch in Concat',
    language: 'python',
    category: 'TypeError',
    code: `def format_user_id(username, id_num):
    # Bug: Cannot concatenate str and int directly with '+'
    result = "User: " + username + " (#" + id_num + ")"
    return result

print(format_user_id("tejas_coder", 42))
`,
    errorMessage: `TypeError: can only concatenate str (not "int") to str on line 3:
    result = "User: " + username + " (#" + id_num + ")"`,
  },
  {
    id: 'py-indentation',
    title: 'Python: Indentation Block Error',
    language: 'python',
    category: 'IndentationError',
    code: `def find_maximum(numbers):
if not numbers:
    return None
max_val = numbers[0]
for num in numbers:
    if num > max_val:
        max_val = num
return max_val

print(find_maximum([3, 10, 2, 8]))
`,
    errorMessage: `IndentationError: expected an indented block after function definition on line 1:
def find_maximum(numbers):`,
  },
  {
    id: 'cpp-out-of-bounds',
    title: 'C++: Vector Out of Bounds',
    language: 'cpp',
    category: 'Vector Out of Bounds',
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> grades = {88, 95, 72, 84};
    
    // Bug: Condition i <= grades.size() attempts to access element at index 4
    for (size_t i = 0; i <= grades.size(); ++i) {
        std::cout << "Grade " << i << ": " << grades[i] << std::endl;
    }
    
    return 0;
}
`,
    errorMessage: `Segmentation fault (core dumped) or unexpected memory read at index 4 (vector size is 4)`,
  },
  {
    id: 'cpp-null-ptr',
    title: 'C++: Null Pointer Dereference',
    language: 'cpp',
    category: 'Pointer / Memory',
    code: `#include <iostream>

struct Node {
    int value;
    Node* next;
};

int main() {
    Node* head = nullptr;
    
    // Bug: Dereferencing nullptr without checking if head != nullptr
    std::cout << "Node value: " << head->value << std::endl;
    
    return 0;
}
`,
    errorMessage: `SIGSEGV: Segmentation fault when dereferencing nullptr 'head' at line 13`,
  },
  {
    id: 'cpp-missing-semi',
    title: 'C++: Missing Semicolon in Struct',
    language: 'cpp',
    category: 'SyntaxError',
    code: `#include <iostream>

struct Point {
    double x;
    double y;
} // Bug: Missing semicolon after struct declaration

int main() {
    Point p = {3.5, 4.2};
    std::cout << "Point: (" << p.x << ", " << p.y << ")" << std::endl;
    return 0;
}
`,
    errorMessage: `error: expected ';' after struct definition
}
 ^
 ;`,
  },
];
