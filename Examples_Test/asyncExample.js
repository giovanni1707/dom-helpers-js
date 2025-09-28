   const maliciousInput = '<script>alert("test")</script><img src=x onerror=alert(1)>';
                        const sanitized = Elements.sanitize(maliciousInput);
                        const isSafe = !sanitized.includes('<script>') && !sanitized.includes('onerror');
