from flask import request, url_for, jsonify, send_from_directory
from flask.ext.api import FlaskAPI, status, exceptions

app = FlaskAPI(__name__, static_url_path='/app')

mem = {}

def solve(eq):
    total = int(eq[0])
    i = 1
    while True:
        if eq[i] == '+':
            total += int(eq[i+1])
            i += 2
        elif eq[i] == '-':
            total -= int(eq[i+1])
            i += 2
        elif eq[i] == '=':
            summ = int(eq[i+1])
            break
        else:
            raise ValueError("Invalid equation: %s" % eq)
    return total == summ

def find_matches(l, total):
    """
    Takes a list of consecutive integers, i.e [1,2,3,4] and a total, i.e 100.
    Uses dynamic programming to recursivly find arrangments of '-' and '+' that, when inserted into the list,
    create an equation that is correct.
    """

    if not l:
        return []

    equations = []
    for i in range(1, len(l)):
        first = list_to_int(l[:i])
        equations.append([str(first), '+', str(list_to_int(l[i:])), '=', str(total)])
        equations.append([str(first), '-', str(list_to_int(l[i:])), '=', str(total)])
        eqs_with_first = find_matches(l[i:], total)
        for eq in eqs_with_first:
            equations.append([str(first), '+'] + eq)
            equations.append([str(first), '-'] + eq)


    # mem[l] = equations
    return equations


def first_n(n, integer):
    """
    Returns the first n digits of an integer
    Ex: If 34567 is passed in with n = 3,
    345 will be returned
    """
    size = len(str(integer))
    return integer / (10 ** (size - n))

def list_to_int(l):
    """
    Takes a list of integers and returns the integer representation
    """
    s = ""
    for num in l:
        s += str(num)

    return int(s)


@app.route("/calc", methods=['GET'])
def calculate_eqs():
    l = int(request.args.get('l'))
    r = int(request.args.get('r'))
    total = int(request.args.get('t'))
    lrange = range(l, r+1)

    equations = [' '.join(e) for e in find_matches(lrange, total) if solve(e)]

    return jsonify(equations)

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory(path)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
