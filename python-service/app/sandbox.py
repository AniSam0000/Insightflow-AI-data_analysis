def safe_exec(code: str, local_vars: dict):
    """
    Executes Python code with restricted built-ins.
    Basic safety layer for MVP.
    """

    allowed_builtins = {
        # I/O
        "print": print,
        # Utilities
        "len": len,
        "range": range,
        "enumerate": enumerate,
        "zip": zip,
        "sorted": sorted,
        "reversed": reversed,
        # Math
        "sum": sum,
        "min": min,
        "max": max,
        "abs": abs,
        "round": round,
        "pow": pow,
        # Types
        "list": list,
        "dict": dict,
        "tuple": tuple,
        "set": set,
        "str": str,
        "int": int,
        "float": float,
        "bool": bool,
        # Type checking
        "type": type,
        "isinstance": isinstance,
        # Object inspection
        "hasattr": hasattr,
        "getattr": getattr,
        "setattr": setattr,
    }

    restricted_globals = {
        "__builtins__": allowed_builtins
    }

    exec(code, restricted_globals, local_vars)