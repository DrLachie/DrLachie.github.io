---
layout: default
title: Events
---
# Events

AusBIAS organises monthly meetings, usually online, where often one member will lead discussion of a paper, method, or problem of the day. We are also involved in hosting training courses at our various institutions, and supporting local conferences.
<hr style="margin: 2em 0;">
<hr style="margin: 2em 0;">

<h2>Upcoming Events</h2>

<div class="events-list">
  {% assign today = 'now' | date: '%Y-%m-%d' %}
  {% assign upcoming_events = site.data.events | sort: 'date' %}
  {% for event in upcoming_events %}
    {% if event.date >= today %}
      <div class="event-item">
        <div class="event-logo">
        {% if event.logo %}
            <img src="{{ event.logo | relative_url }}" alt="{{ event.title }} logo">
          </div>
        {% endif %}
        <div class="event-info">
          <strong>{{ event.title }}</strong><br>
          <small>{{ event.date | date: "%B %d, %Y" }} – {{ event.location }}</small><br>
          <a href="{{ event.url }}" target="_blank">More info</a>
          <p>{{ event.description }}</p>
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>

<h2>Past Events</h2>

<div class="events-list">
  {% assign today = 'now' | date: '%Y-%m-%d' %}
  {% assign past_events = site.data.events | sort: 'date' | reverse %}
  {% for event in site.data.events %}
    {% if event.date < today %}
    <div class="event-item">
        <div class="event-logo">
        {% if event.logo %}
            <img src="{{ event.logo | relative_url }}" alt="{{ event.title }} logo">
          </div>
        {% endif %}
        <div class="event-info">
          <strong>{{ event.title }}</strong><br>
          <small>{{ event.date | date: "%B %d, %Y" }} – {{ event.location }}</small><br>
          <a href="{{ event.url }}" target="_blank">More info</a>
          <p>{{ event.description }}</p>
        </div>
      </div>
  {% endif %}
{% endfor %}
</div>
