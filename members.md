---
layout: default
title: Members
---

<h2>Our Members</h2>

<ul>
  {% for member in site.data.members %}
    <li>
      <a href="/members/{{ member.username }}/">{{ member.name }}</a>
    </li>
  {% endfor %}
</ul>
